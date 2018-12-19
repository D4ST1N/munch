<template>
  <div class="game-status">
    <div class="game-status__content">
      <h2 class="game-status__players">{{ $text('GAME_STATUS.PLAYERS') }}</h2>
      <div class="game-status__players-list">
        <div v-for="player in players" :id="player.name" class="game-status__player">
          <div class="game-status__player-name">{{ player.name }}</div>
          <div
            :class="{
              'game-status__player-state': true,
              'game-status__player-state--ready': player.ready
            }"
          ></div>
        </div>
      </div>
      <div class="game-status__action" @click="action">{{ $text(buttonText) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameStatus',

  props: {
    name: String,
  },

  data() {
    return {
      players: [],
      state: 'authorized',
    };
  },

  computed: {
    buttonText() {
      switch (this.state) {
        case 'joined':
          return 'GAME_STATUS.READY';

        case 'ready':
          return 'GAME_STATUS.WAIT';

        default:
          return 'GAME_STATUS.JOIN';
      }
    }
  },

  created() {
    this.$root.$on('gameStatus', (playersList) => {
      console.log('game status');
      this.players = playersList;
      this.updateState();
    });
  },

  methods: {
    action() {
      if (this.state === 'authorized') {
        this.join();
      } else if (this.state === 'joined') {
        this.ready();
      }
    },

    join() {
      this.$emit('join');
    },

    ready() {
      this.$emit('ready');
    },

    updateState() {
      const player = this.players.find(player => player.name === this.name);

      if (!player) {
        this.state = 'authorized';
      } else if (player.ready) {
        this.state = 'ready';
      } else {
        this.state = 'joined';
      }
    },
  }
};
</script>

<style lang="scss">
  .game-status {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;

    &__content {
      background: rgba(55,71,79 ,1);
      color: #fff;
      padding: 20px 40px;
      text-align: center;
    }

    &__action {
      padding: 8px 24px;
      color: #fff;
      background: rgba(33,150,243 ,1);
      border: 0;
      font-size: 20px;
      margin: 16px;
      cursor: pointer;
    }

    &__players-list {
      display: flex;
      flex-direction: column;
    }

    &__player {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      margin-bottom: 4px;
      background: rgba(255, 255, 255, .1);

      &-state {
        display: inline-block;
        width: 24px;
        height: 24px;

        &--ready {
          background: url("../../assets/img/checked.png") no-repeat center;
        }
      }
    }
  }
</style>
