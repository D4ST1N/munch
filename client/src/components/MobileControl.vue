<template>
  <div class="mobile-control">
    <div
      class="mobile-control__joystick"
      @touchstart="touchStart"
    ></div>
  </div>
</template>

<script>
import getElementPosition from '../assets/utils/getElementPosition';

export default {
  name: 'MobileControl',
  data() {
    return {
      position: { x: 0, y: 0 },
    };
  },

  mounted() {
    this.position = getElementPosition({ target: this.$el }, true);
  },

  methods: {
    touchStart(event) {
      const mobileControlSize = {
        width: 100,
        height: 100,
      };
      event.target.ontouchmove = (event) => {
        const x = event.targetTouches[0].pageX - this.position.x;
        const y = event.targetTouches[0].pageY - this.position.y;
        const center = {
          x: mobileControlSize.width / 2,
          y: mobileControlSize.height / 2,
        };
        const radiansToDegrees = (radians) => {
          return radians * 180 / Math.PI;
        };

        const point = {
          x: Math.abs(x - center.x),
          y:Math.abs(y - center.y)
        };

        const angle = radiansToDegrees(Math.atan(point.x / point.y));

        const movement = {
          up: angle <= 60 && y < mobileControlSize.height / 2,
          down: angle <= 60 && y > mobileControlSize.height / 2,
          left: angle >= 30 && x < mobileControlSize.width / 2,
          right: angle >= 30 && x > mobileControlSize.width / 2,
        };

        const joystickPosition = {
          x: Math.max(Math.min(x - center.x, mobileControlSize.width / 2), mobileControlSize.width / -2),
          y: Math.max(Math.min(y - center.y, mobileControlSize.height / 2), mobileControlSize.height / -2),
        };

        event.target.style.transform = `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`;

        this.$emit('mobileControl', movement);
      };

      event.target.ontouchend = () => {
        event.target.ontouchmove = null;
        event.target.style.transform = '';
        this.$emit('mobileControl', {
          up: false,
          down: false,
          left: false,
          right: false,
        });
      };
    },

    touchMove(event) {
      console.log(event);
    },
  }
};
</script>

<style scoped lang="scss">
  .mobile-control {
    position: fixed;
    left: 5px;
    bottom: 5px;
    width: 100px;
    height: 100px;
    border: 4px solid rgba(255, 255, 255, .4);
    border-radius: 50%;
    box-sizing: border-box;

    &__joystick {
      position: absolute;
      top: 36px;
      left: 36px;
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, .6);
      border-radius: 50%;
    }
  }
</style>
