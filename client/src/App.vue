<template>
  <div id="app">
    <canvas ref="field" width="800" height="600" class="field" @click="shoot"></canvas>
    <div class="fps" @click="showColorChange = true">{{ fps }}</div>
    <PlayerSettings v-if="showColorChange" @changeColor="changePlayerColor" />
  </div>
</template>

<script>
import renderer from './assets/mixins/render';
import gameConfig  from './config';
import cookie from './assets/utils/cookie';
import PlayerSettings from './components/PlayerSettings';

const socket = window.io();

export default {
  name: 'app',
  components: {
    PlayerSettings,
  },
  mixins: [renderer],

  data() {
    return {
      canvas: null,
      context: null,
      lastTick: performance.now(),
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
      ratio: 1,
      playerId: null,
      showColorChange: false,
      bullets: [],
    }
  },

  mounted() {
    const playerId = cookie.get('playerId');
    const playerColor = cookie.get('playerColor');

    if (playerColor) {
      this.playerColor = playerColor;
    } else {
      this.showColorChange = true;
    }

    if (playerId) {
      socket.emit('playerConnect', playerId);
      this.playerId = playerId;
    } else {
      socket.on('message', (id) => {
        cookie.set('playerId', id);
        this.playerId = id;
      });
      socket.emit('newPlayer');
    }

    socket.on('state', this.update);
    this.init();
    this.start();
  },

  methods: {
    init() {
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
      this.main(performance.now());
    },

    main(now) {
      this.gameTick = now - this.lastTime;
      const delta = this.gameTick / 1000;
      this.fps = Math.round(1 / delta);
      this.lastTime = now;
      socket.emit('movement', { id: this.playerId, movement: this.movement });
      this.render();
      this.raf = requestAnimationFrame(this.main);
    },

    update(newPlayersState) {
      this.playersState = newPlayersState;
      this.bullets.forEach((bullet) => {
        bullet.pos.x += bullet.direction.x * this.ratio;
        bullet.pos.y += bullet.direction.y * this.ratio;
      });
    },

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      Object.entries(this.playersState).forEach(([id, player]) => {
        this.renderRectangle({
          pos: {
            x: player.x * this.ratio,
            y: player.y * this.ratio,
          },
          size: {
            width: 24 * this.ratio,
            height: 24 * this.ratio,
          },
          color: id === this.playerId ? this.playerColor : 'white',
        });
      });

      this.bullets.forEach((bullet) => {
        this.renderRectangle({
          pos: {
            x: bullet.pos.x * this.ratio,
            y: bullet.pos.y * this.ratio,
          },
          size: {
            width: 4 * this.ratio,
            height: 4 * this.ratio,
          },
          color: 'red',
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
          this.movement.down = true;
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
      const widthRatio = width / gameConfig.gameFieldSize.width;
      const heightRation = height / gameConfig.gameFieldSize.height;

      return Math.min(widthRatio, heightRation);
    },

    getFieldSize() {
      return {
        width: gameConfig.gameFieldSize.width * this.ratio,
        height: gameConfig.gameFieldSize.height * this.ratio,
      };
    },

    changePlayerColor(color) {
      this.playerColor = color;
      this.showColorChange = false;
    },

    shoot(event) {
      console.log(this.playersState);
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; //x position within the element.
      const y = event.clientY - rect.top;  //y position within the element.
      const startPos = {
        x: this.playersState[this.playerId].x + 12,
        y: this.playersState[this.playerId].y + 12,
      };
      console.log(x / this.ratio, y / this.ratio);

      const width = Math.abs(x - startPos.x);
      const height = Math.abs(y - startPos.y);
      const bullet = {
        pos: startPos,
        direction: {},
      };

      console.log(width, height);

      if (width > height) {
        bullet.direction.x = 1;
        bullet.direction.y = 1 / (width / height);
      } else {
        bullet.direction.x = 1 / (height / width);
        bullet.direction.y = 1;
      }

      console.log(bullet.direction);

      if (startPos.x > x) {
        bullet.direction.x *= -1;
      }

      if (startPos.y > y) {
        bullet.direction.y *= -1;
      }

      this.bullets.push(bullet);
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
  }
</style>
