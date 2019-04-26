<template>
  <div class="game-log">
    <div class="game-log__content">
      <GameLogMessage
        v-for="message in messages"
        :text="$text(message.key, message.options)"
        :options="message.options"
      ></GameLogMessage>
    </div>
  </div>
</template>

<script>
  import Socket from '../../../entities/Socket';
  import GameLogMessage from './GameLogMessage';

  export default {
    name: 'GameLog',
    components: {
      GameLogMessage,
    },

    data() {
      return {
        messages: [
          // {
          //   key: 'GAME.LOGS.PLAYER_USE_CARD_ON_PLAYER',
          //   options: {
          //     who: 'd4st1n',
          //     whom: 'Joker',
          //     component: {
          //       name: 'attack',
          //       size: 'tiny',
          //     }
          //   }
          // }
        ],
      };
    },

    created() {
      this.$root.$on('showMessage', (message) => {
        this.messages.unshift(message);
      });
      Socket.on('gameMessage', this.onGameMessage);
    },

    beforeDestroy() {
      Socket.off('gameMessage', this.onGameMessage);
    },

    methods: {
      onGameMessage(message) {
        console.log(message);
        this.messages.unshift(message);
      },
    }
  };
</script>

<style lang="scss">
  .game-log {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 1;

    &__content {
      width: 360px;
      height: 60vh;
      padding: 10px;
      background: var(--ui-game-log-background-color);
      border-radius: 8px;
      overflow: auto;
      max-height: 60vh;
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
