<template>
  <div class="game-log">
    <div class="game-log__content">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="{ 'game-log__message': true, 'game-log__message--active': index === 0 }"
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
        this.messages.unshift(message);
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
      background: var(--ui-game-log-background-color);
      border-radius: 8px;
      overflow: auto;
      max-height: 50vh;
    }

    &__message {
      margin-bottom: 8px;
      color: var(--ui-game-log-message-color);

      &--active {
        color: var(--ui-game-log-active-message-color);
      }
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
    margin-left: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    background: var(--ui-game-log-scroll-color);
  }
</style>
