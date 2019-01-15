<template>
  <div v-show="seconds > 0" class="timer">
    <canvas ref="canvas" class="timer__canvas"></canvas>
    <div class="timer__time">{{ seconds }}</div>
  </div>
</template>

<script>
  import canvas            from '../../assets/mixins/canvas';
  import render            from '../../assets/mixins/render';
  import CircleProgress    from '../../assets/utils/canvasEntities/CircleProgress';
  import getColorGradation from '../../assets/utils/getColorGradation';

  export default {
    name: 'Timer',
    mixins: [canvas, render],
    props: {
      time: Number,
    },

    data() {
      return {
        startTime: 0,
        progress: null,
        seconds: 0,
      };
    },

    mounted() {
      this.seconds = this.time / 1000;
      this.progress = new CircleProgress({
        pos: {
          x: 82,
          y: 82,
        },
        radius: 74,
        color: "#FF9800",
        width: 12,
      });

      this.init([this.progress], {
        width: 200,
        height: 200,
      });

      this.startTime = performance.now();
      this.start();
    },

    methods: {
      update(now) {
        const timePass = now - this.startTime;

        this.seconds = Math.max(Math.ceil((this.time - timePass) / 1000), 0);

        if (timePass >= this.time) {
          this.stop();
          this.$emit('timerEnd');

          return [];
        }

        const progressPercent = Math.min(timePass / this.time, 1);

        this.progress.props.percent = 1 - (-0.5 + progressPercent * 2);
        this.progress.props.color = getColorGradation('rgb(102,187,106)', 'rgb(239,83,80)', progressPercent * 100);

        return [this.progress];
      },
    },
  };
</script>

<style lang="scss">
  .timer {
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &__canvas {
      position: absolute;
      left: -2px;
      top: -2px;
    }

    &__time {
      font-size: 48px;
      color: #fff;
    }
  }
</style>
