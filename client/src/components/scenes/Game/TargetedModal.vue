<template>
  <div v-if="targeted" class="TargetedModal">
    <div class="TargetedModal__content">
      <h1>{{ $text('NOTIFICATIONS.GAME.YOURE_TARGETED') }}</h1>
    </div>
  </div>
</template>

<script>
  import Socket from '../../../entities/Socket';

  export default {
    name: 'TargetedModal',
    data() {
      return {
        targeted: false,
      };
    },

    created() {
      console.log('created');
      Socket.on('gameUpdate', (data) => {
        console.log('targeted');
        console.log(data);
        this.targeted = data.targeted;
      });
    }
  };
</script>

<style lang="scss" scoped>
  .TargetedModal {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50%;
    pointer-events: none;

    &__content {
      background: #E65100;
      color: #fff;
      padding: 10px 30px;
    }
  }
</style>
