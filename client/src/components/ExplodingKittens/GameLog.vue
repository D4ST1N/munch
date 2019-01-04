<template>
  <div class="game-log">
    <div class="game-log__content">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="game-log__message"
      >
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameLog',

    data() {
      return {
        messages: [],
      };
    },

    created() {
      this.$root.$on('showMessage', (message) => {
        this.messages.push(message);
      });
    },
  };
</script>

<style lang="scss">
  .game-log {
    position: fixed;
    right: 20px;
    top: 20px;

    &__content {
      width: 360px;
      height: 50vh;
      padding: 10px;
      background: rgba(55,71,79, .6);
      border-radius: 8px;
      overflow: auto;
      max-height: 50vh;
    }

    &__message {
      margin-bottom: 8px;
      color: #fff;
    }
  }
</style>
