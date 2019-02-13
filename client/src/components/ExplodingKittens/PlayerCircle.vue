<template>
  <div :class="playerClass" @click="onClick">
    <canvas ref="canvas" class="player-circle__canvas"></canvas>
    <div
      :class="{
        'player-circle__name': true,
        'player-circle__name--current': playerName === name
      }"
    >{{ name }}</div>
  </div>
</template>

<script>
  import canvas         from '../../assets/mixins/canvas';
  import render         from '../../assets/mixins/render';
  import CircleProgress from '../../assets/utils/canvasEntities/CircleProgress';

  export default {
    name: 'PlayerCircle',
    mixins: [canvas, render],
    props: {
      name: String,
      current: Boolean,
      exploded: Boolean,
    },

    data() {
      return {
        time: 0,
        startTime: 0,
        progress: null,
        playerName: this.$store.getters.player.username
      }
    },

    computed: {
      playerClass() {
        return {
          'player-circle': true,
          'player-circle--current': this.current,
          'player-circle--exploded': this.exploded,
        };
      },
    },

    mounted() {
      this.$store.getters.socket.on('startTimer', this.onStartTimer);
      this.$store.getters.socket.on('stopTimer', this.onStopTimer);
    },

    methods: {
      onClick() {
        this.$emit('playerClick');
      },

      onStartTimer(time) {
        this.time = time;
        this.progress = new CircleProgress({
          pos: {
            x: 62,
            y: 62,
          },
          radius: 60,
          color: "white",
          width: 6,
        });

        console.log(this.$refs);
        this.init([this.progress], {
          width: 200,
          height: 200,
        });

        this.startTime = performance.now();
        this.start();
      },

      onStopTimer() {
        this.time = 0
      },

      update(now) {
        const timePass = now - this.startTime;

        if (timePass >= this.time) {
          this.stop();
          this.$emit('timerEnd');

          return [];
        }

        const progressPercent = Math.min(timePass / this.time, 1);

        this.progress.props.percent = 1 - (-0.5 + progressPercent * 2);

        return [this.progress];
      },
    },
  };
</script>

<style lang="scss">
  .player-circle {
    width: 128px;
    height: 128px;
    background: var(--ui-player-circle-background-color);
    border-radius: 50%;
    border: 6px dotted var(--ui-player-circle-border-color);
    position: relative;
    margin: 16px;
    cursor: pointer;
    transition: all .375s;

    &--current {
      transform-origin: 50% 0;
      transform: scale(1.2);
      pointer-events: none;

      .game-room-players__container--active & {
        opacity: 0.25;
      }
    }

    &--exploded {
      &::before,
      &::after {
        content: '';
        width: 140%;
        height: 4px;
        position: absolute;
        top: calc(50% - 2px);
        left: -20%;
        background: rgb(69,90,100);
        transform-origin: 50% 50%;
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }

    &__name {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 4px;
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, .4);
      background: var(--ui-player-circle-label-background-color);
      color: var(--ui-player-circle-label-color);
      border-radius: 4px;

      &--current {
        background: var(--ui-player-circle-label-current-background-color);
      }
    }

    &__canvas {
      position: relative;
      top: -4px;
      left: -4px;
      pointer-events: none;
    }
  }
</style>
