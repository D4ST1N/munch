<template>
  <div :class="{ 'ReadyBlock': true, 'ReadyBlock--ready': ready }">
    <div class="ReadyBlock__content">
      <div class="ReadyBlock__title">{{ $text('GAME_ROOMS.PRESS_READY') }}</div>
      <div class="ReadyBlock__respectCat"></div>
      <button class="ReadyBlock__readyBtn" @click="onReady">F</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReadyBlock',
    props: {
      ready: {
        type: Boolean,
        default: true,
      },
    },

    created() {
      document.body.addEventListener('keyup', this.onKeyUp);
    },

    beforeDestroy() {
      document.body.removeEventListener('keyup', this.onKeyUp);
    },

    methods: {
      onReady() {
        this.$emit('ready');
      },

      onKeyUp(event) {
        if (event.code === 'KeyF') {
          this.onReady();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ReadyBlock {
    height: 300px;
    transition: all .5s;
    overflow: hidden;

    &--ready {
      height: 0;
    }

    &__content {
      position: relative;
      width: 600px;
      height: 300px;
    }

    &__title {
      margin-bottom: 20px;
      color: #fff;
      font-size: 30px;
      text-align: center;
    }

    &__respectCat {
      height: 200px;
      width: 500px;
      background: url('../../../assets/img/respect-cat.png') no-repeat center;
    }

    &__readyBtn {
      width: 150px;
      height: 150px;
      margin-top: -80px;
      margin-left: 80px;
      border-radius: 50%;
      border: 3px solid #fff;
      color: #fff;
      background: #f44336;
      font-size: 100px;
      transform: scale(1, .5);
      cursor: pointer;
      box-shadow: 0 5px 0 0 #fff,
                  0 10px 0 0 #fff,
                  0 15px 0 0 #fff,
                  0 20px 0 0 #fff,
                  0 25px 6px 0 rgba(0, 0, 0, .3);
      transition: all .375s ease;

      &:hover {
        background: #e53935;
        box-shadow: 0 5px 0 0 #fff,
                    0 10px 0 0 #fff,
                    0 15px 0 0 #fff,
                    0 20px 0 0 #fff,
                    0 28px 6px 0 rgba(0, 0, 0, .4);
      }
    }
  }
</style>
