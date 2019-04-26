<template>
  <div v-show="time" class="Timer">
    <canvas ref="canvas" class="Timer__canvas"></canvas>
    <div v-if="showSeconds" class="Timer__seconds-wrapper">
      <div
        v-for="second in 5"
        :style="{ 'animation-delay': `${second}s` }"
        class="Timer__seconds">
        {{ 5 - second }}
      </div>
    </div>
  </div>
</template>

<script>
  import Socket from '../../../entities/Socket';
  import canvas from '../../../assets/mixins/canvas';
  import render from '../../../assets/mixins/render';
  import Rectangle from '../../../assets/utils/canvasEntities/Rectangle';
  import getColorGradation from '../../../assets/utils/getColorGradation';

  export default {
    name: 'Timer',
    mixins: [canvas, render],

    data() {
      return {
        time: 0,
        progress: null,
        startTime: 0,
        maxWidth: 2200 - 28,
        showSeconds: false,
        tasks: [],
      }
    },

    created() {
      Socket.on('timerStarted', this.onTimerStart);
      Socket.on('timerStopped', this.onTimerStop);
    },

    mounted() {
      console.log(this.tasks);
    },

    methods: {
      onTimerStart({ time }) {
        console.log(this.$refs);
        if (!this.$refs.canvas) {
          this.tasks.push({ time });
          return;
        }

        this.time = time;
        this.progress = new Rectangle({
          pos: {
            x: 0,
            y: 0,
          },
          color: "green",
          size: {
            height: 8,
            width: this.maxWidth,
          }
        });

        this.init([this.progress], {
          width: this.maxWidth,
          height: 8,
        });

        this.startTime = performance.now();
        this.start();
      },

      onTimerStop() {
        this.stop();
        this.showSeconds = false;
        this.time = 0;
      },

      update(now) {
        const timePass = now - this.startTime;

        if (!this.showSeconds && this.time - timePass <= 5000) {
          this.showSeconds = true;
        }

        if (timePass >= this.time) {
          this.onTimerStop();

          return [];
        }

        const progressPercent = Math.min(timePass / this.time, 1);

        this.progress.props.size.width = this.maxWidth * (1 - progressPercent);
        this.progress.props.color = getColorGradation('rgb(102,187,106)', 'rgb(239,83,80)', progressPercent * 100);

        return [this.progress];
      },
    }
  };
</script>

<style lang="scss">
  .Timer {
    position: fixed;
    left: 14px;
    bottom: 14px;
    height: 12px;
    width: calc(100% - 28px);
    background: #fff;
    border-radius: 3px;
    z-index: 1;
    animation: progress-in 0.25s ease;

    &__canvas {
      position: absolute;
      top: 2px;
      left: 4px;
    }

    &__seconds {
      position: fixed;
      top: 30%;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 70%;
      font-size: 128px;
      font-weight: 900;
      color: #fff;
      opacity: 0;
      animation: second-in .66s ease-out both;
      pointer-events: none;
    }
  }

  @keyframes progress-in {
    0% {
      opacity: 0;
      transform: translate(0, 150%);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  @keyframes second-in {
    0% {
      transform: scale(5);
      opacity: 0;
    }
    85% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>
