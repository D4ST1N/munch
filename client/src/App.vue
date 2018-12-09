<template>
  <div id="app">
    <canvas ref="field" width="800" height="600" class="field" @click="shoot"></canvas>
    <div class="fps">{{ fps }}</div>
    <PlayerSettings v-if="showColorChange" @close="setPlayerInfo" />
    <EventLog />
    <DiePopup @restart="restart" />
  </div>
</template>

<script>
import axios from 'axios';
import renderer from './assets/mixins/render';
import cookie from './assets/utils/cookie';
import PlayerSettings from './components/PlayerSettings';
import EventLog from './components/EventLog';
import DiePopup from './components/DiePopup';

const socket = window.io();

export default {
  name: 'app',
  components: {
    PlayerSettings,
    EventLog,
    DiePopup,
  },
  mixins: [renderer],

  data() {
    return {
      canvas: null,
      context: null,
      lastTick: 0,
      gameTick: 0,
      fps: 60,
      raf: null,
      movement: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
      playersState: {},
      playerColor: '#fff',
      playerName: '',
      ratio: 1,
      showColorChange: false,
      bullets: [],
      rays: [],
      lastShoot: performance.now(),
      now: performance.now(),
      config: null,
    }
  },

  created() {
    axios.get('/config')
         .then((response) => {
           this.config = response.data;

           const playerColor = cookie.get('playerColor');
           const playerName = cookie.get('playerName');

           if (playerColor && playerName) {
             this.playerName = playerName;
             this.playerColor = playerColor;

             socket.emit('playerConnect', playerName);

             this.init();
             this.start();
           } else {
             this.showColorChange = true;
           }
         })
         .catch(console.error);
  },

  methods: {
    restart() {
      socket.emit('playerConnect', this.playerName);
    },

    init() {
      socket.on('state', this.update);
      socket.on('message', (message) => {
        this.$root.$emit('event', message);

        if (message.type === 'frag' && message.whom === this.playerName) {
          this.$root.$emit('playerShooted', message.who);
        }
      });

      this.canvas = this.$refs.field;
      this.context = this.canvas.getContext('2d');
      this.ratio = this.getRatio();

      const fieldSize = this.getFieldSize();

      this.canvas.width = fieldSize.width;
      this.canvas.height = fieldSize.height;

      document.body.addEventListener('keydown', this.handleKeyDown);
      document.body.addEventListener('keyup', this.handleKeyUp);
      window.onresize = () => {
        this.ratio = this.getRatio();
        const fieldSize = this.getFieldSize();
        this.canvas.width = fieldSize.width;
        this.canvas.height = fieldSize.height;
      };
    },

    start() {
      this.main(this.now);
    },

    main(now) {
      this.now = now;
      this.gameTick = now - this.lastTime;
      const delta = this.gameTick / 1000;
      this.fps = Math.round(1 / delta);
      this.lastTime = now;
      socket.emit('movement', { id: this.playerName, movement: this.movement });
      this.render();
      this.raf = requestAnimationFrame(this.main);
    },

    update({ players, bullets }) {
      this.playersState = players;
      this.bullets = bullets;
    },

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      Object.entries(this.playersState).forEach(([id, player]) => {
        this.renderCircle({
          pos: {
            x: player.x * this.ratio,
            y: player.y * this.ratio,
          },
          size: this.config.playerSize * this.ratio,
          color: id === this.playerName ? this.playerColor : 'white',
        });
        this.renderText({
          pos: {
            x: player.x * this.ratio,
            y: (player.y - 24) * this.ratio,
          },
          text: id,
          color: '#fff',
          font: `${ 14 * this.ratio }px serif`,
          maxSize: this.config.playerSize * 4 * this.ratio,
        });
      });

      if (this.playersState[this.playerName]) {
        const playerData = this.playersState[this.playerName];
        const x = this.playersState[this.playerName].x;
        const y = this.playersState[this.playerName].y;
        const trueShootSpeed = this.config.playerShootSpeed - playerData.shootSpeedBonus;
        const reloadPercent = Math.min((this.now - this.lastShoot) / trueShootSpeed, 1);
        const percent = -0.5 + (reloadPercent * 100) / 50;

        this.context.beginPath();
        this.context.arc(x * this.ratio, y * this.ratio, this.config.playerSize * this.ratio, -0.5 * Math.PI, percent * Math.PI);
        this.context.strokeStyle = 'rgba(142,36,170 ,1)';
        this.context.lineWidth = 2;
        this.context.stroke();
      }

      this.bullets.forEach((bullet) => {
        this.renderRectangle({
          pos: {
            x: bullet.pos.x * this.ratio,
            y: bullet.pos.y * this.ratio,
          },
          size: {
            width: this.config.bulletSize * this.ratio,
            height: this.config.bulletSize * this.ratio,
          },
          color: 'white',
        });
      });
    },

    handleKeyDown(event) {
      switch (event.code) {
        case 'KeyA':
          this.movement.left = true;
          break;
        case 'KeyW':
          this.movement.up = true;
          break;
        case 'KeyD':
          this.movement.right = true;
          break;
        case 'KeyS':
          if (event.ctrlKey && event.shiftKey) {
            this.showColorChange = true;
          } else {
            this.movement.down = true;
          }
          break;
      }
    },

    handleKeyUp(event) {
      switch (event.code) {
        case 'KeyA':
          this.movement.left = false;
          break;
        case 'KeyW':
          this.movement.up = false;
          break;
        case 'KeyD':
          this.movement.right = false;
          break;
        case 'KeyS':
          this.movement.down = false;
          break;
      }
    },

    getRatio() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthRatio = width / this.config.fieldSize.width;
      const heightRation = height / this.config.fieldSize.height;

      return Math.min(widthRatio, heightRation);
    },

    getFieldSize() {
      return {
        width: this.config.fieldSize.width * this.ratio,
        height: this.config.fieldSize.height * this.ratio,
      };
    },

    setPlayerInfo({ name, color }) {
      this.playerName = name;
      this.playerColor = color;
      this.showColorChange = false;

      socket.emit('playerConnect', name);

      this.init();
      this.start();
    },

    changePlayerColor(color) {
      this.playerColor = color;
      this.showColorChange = false;
    },

    shoot(event) {
      if (this.now - this.lastShoot < this.config.playerShootSpeed - this.playersState[this.playerName].shootSpeedBonus) {
        return;
      }

      const rect = event.target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / this.ratio;
      const y = (event.clientY - rect.top) / this.ratio;

      const startPos = {
        x: this.playersState[this.playerName].x,
        y: this.playersState[this.playerName].y,
      };

      const width = Math.abs(x - startPos.x);
      const height = Math.abs(y - startPos.y);

      const bullet = {
        pos: startPos,
        direction: {},
        who: this.playerName,
      };

      const distance = Math.sqrt(width**2 + height**2);
      const difference = distance / this.config.bulletSpeed;

      bullet.direction.x = width / difference;
      bullet.direction.y = height / difference;

      if (startPos.x > x) {
        bullet.direction.x *= -1;
      }

      if (startPos.y > y) {
        bullet.direction.y *= -1;
      }

      bullet.pos.x += bullet.direction.x * 3;
      bullet.pos.y += bullet.direction.y * 3;

      socket.emit('shoot', bullet);
      this.lastShoot = this.now;
    },
  }
};
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body {
    margin: 0;
    padding: 0;
    background: rgba(96,125,139 ,1);
    user-select: none;
  }

  .field {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(33,150,243 ,1);
  }

  .fps {
    position: fixed;
    top: 10px;
    left: calc(50% - 15px);
    pointer-events: none;
  }
</style>
