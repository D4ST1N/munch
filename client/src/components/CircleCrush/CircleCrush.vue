<template>
  <div class="circle-crush">
    <canvas
      ref="field"
      width="800"
      height="600"
      :class="{ 'field': true, 'field--mobile': isMobile() }"
      @click="shoot"
      @touchstart="touchShoot"
    ></canvas>
    <div class="fps">{{ fps }}</div>
    <PlayerSettings v-if="showColorChange" @close="setPlayerInfo" />
    <EventLog />
    <DiePopup @restart="restart" />
    <ScoreBoard />
    <MobileControl v-if="isMobile()" @mobileControl="mobileControl" />
  </div>
</template>

<script>
import axios              from 'axios';
import renderer           from '../../assets/mixins/render';
import cookie             from '../../assets/utils/cookie';
import PlayerSettings     from './PlayerSettings';
import EventLog           from './EventLog';
import DiePopup           from './DiePopup';
import ScoreBoard         from './ScoreBoard';
import MobileControl      from './MobileControl';
import getElementPosition from '../../assets/utils/getElementPosition';
import makeTransparent    from '../../assets/utils/makeTransparent';

let socket;

export default {
  name: 'CircleCrush',
  components: {
    PlayerSettings,
    EventLog,
    DiePopup,
    ScoreBoard,
    MobileControl,
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
      barricades: [],
      tick: 0,
    };
  },

  created() {
    socket = window.io({ path: '/ws/circle-crush' });
    axios.get('/circle-crush/config')
         .then((response) => {
           this.config = response.data;

           const playerColor = cookie.get('playerColor');
           const playerName = cookie.get('playerName');

           if (playerColor && playerName) {
             this.playerName = playerName;
             this.playerColor = playerColor;

             socket.emit('playerReconnect', playerName, sessionStorage.getItem('gameId'));

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
      socket.on('barricades', (barricades) => {
        this.barricades = barricades;
      });
      socket.on('message', (message) => {
        this.$root.$emit('event', message);

        if (message.type === 'frag' && message.whom === this.playerName) {
          this.$root.$emit('playerShooted', message.who);
        }
      });
      socket.on('score', (score, gameId) => {
        sessionStorage.setItem('gameId', gameId);
        this.$root.$emit('score', score);
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
      this.tick = this.tick === 5 ? 0 : this.tick + 1;
      this.playersState = players;
      this.bullets = bullets;
    },

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.barricades.forEach((barricade) => {
        this.renderRectangle({
          pos: {
            x: barricade.pos.x * this.ratio,
            y: barricade.pos.y * this.ratio,
          },
          size: {
            width: barricade.size.width * this.ratio,
            height: barricade.size.height * this.ratio,
          },
          color: barricade.color,
        });
      });

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

      Object.entries(this.playersState).forEach(([id, player]) => {
        const opacity = player.isImmune ? (this.tick < 3 ? 0.25 : 1) : 1;
        this.renderCircle({
          pos: {
            x: player.x * this.ratio,
            y: player.y * this.ratio,
          },
          size: this.config.playerSize * this.ratio,
          color: makeTransparent(
            (id === this.playerName ? this.playerColor : 'rgba(255, 255, 255, 1)'),
            opacity
          ),
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

        this.renderCircleProgress({
          percent,
          pos: {
            x: x * this.ratio,
            y: y * this.ratio,
          },
          radius: this.config.playerSize * this.ratio,
          start: -0.5,
          color: 'rgba(142,36,170 ,1)',
          width: 2,
        });
      }
    },

    handleKeyDown(event) {
      switch (event.code) {
        case 'KeyA':
          this.movement.left = true;
          this.movement.right = false;
          break;
        case 'KeyW':
          this.movement.up = true;
          this.movement.down = false;
          break;
        case 'KeyD':
          this.movement.right = true;
          this.movement.left = false;
          break;
        case 'KeyS':
          if (event.ctrlKey && event.shiftKey) {
            this.showColorChange = true;
          } else {
            this.movement.down = true;
            this.movement.up = false;
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

    mobileControl(movement) {
      this.movement = movement;
    },

    getRatio() {
      const width = window.innerWidth - (this.isMobile() ? 100 : 0);
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

    setPlayerInfo({ name, color, isNew, oldName }) {
      this.playerName = name;
      this.playerColor = color;
      this.showColorChange = false;

      if (isNew) {
        socket.emit('playerConnect', name);
        this.init();
        this.start();
      } else {
        socket.emit('changePlayerName', {
          name,
          oldName,
        });
      }
    },

    changePlayerColor(color) {
      this.playerColor = color;
      this.showColorChange = false;
    },

    touchShoot(event) {
      this.shoot(event.targetTouches[0]);
    },

    shoot(event) {
      if (this.now - this.lastShoot < this.config.playerShootSpeed - this.playersState[this.playerName].shootSpeedBonus) {
        return;
      }

      const position = getElementPosition(event);
      const x = position.x / this.ratio;
      const y = position.y / this.ratio;

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

      socket.emit('shoot', bullet);
      this.lastShoot = this.now;
    },

    isMobile() {
      return (navigator.userAgent.match(/Android|iPhone/ig) || []).length;
    },
  },
};
</script>

<style lang="scss">
  .field {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(33,150,243 ,1);

  &--mobile {
     right: 0;
     left: initial;
     transform: translate(0, -50%);
   }
  }

  .fps {
    position: fixed;
    top: 10px;
    left: calc(50% - 15px);
    pointer-events: none;
  }
</style>
