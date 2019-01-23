<template>
  <div class="game-room-players">
    <div
      :class="{
        'game-room-players__container': true,
        'game-room-players__container--active': !!action
      }"
    >
      <PlayerCircle
        v-for="player in players"
        :key="player.name"
        :name="player.name"
        :current="isCurrent(player.name)"
        :exploded="player.exploded"
        @playerClick="playerClick(player)"
      />
    </div>
    <div v-if="!!action" class="game-room-players__label">
      {{ $text('NOTIFICATIONS.GAME.CHOOSE_PLAYER') }}
    </div>
  </div>
</template>

<script>
  import PlayerCircle from './PlayerCircle';

  export default {
    name: 'GameRoomPlayers',
    components: {
      PlayerCircle,
    },

    data() {
      return {
        players: [],
        playerName: this.$store.getters.player.name,
        current: '',
        context: null,
        action: null,
      };
    },

    created() {
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
      this.$root.$on('choosePlayer', this.onChoosePlayer);
      this.$root.$on('gameUpdate', this.updateStats);
    },

    methods: {
      updateStats(gameData) {
        console.log('game update');
        this.updatePlayersList(gameData.players);
        this.current = gameData.currentPlayer;
      },

      isCurrent(name) {
        return name === this.current;
      },

      updatePlayersList(players) {
        this.players = players.filter(player => player.name !== this.playerName);
      },

      onChoosePlayer({ context, action }) {
        this.event = event;
        this.context = context;
        this.action = action;
      },

      playerClick(player) {
        if (this.action) {
          this.action.call(this.context, player.name);

          this.action = null;
          this.context = null;
        }
      },
    },
  };
</script>

<style lang="scss">
  .game-room-players {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1;

    &__container {
      display: flex;

      &--active {
        background: rgba(207,216,220 ,1);
        box-shadow: 0 0 0 100vw rgba(38,50,56 ,.8);
      }
    }

    &__label {
      position: absolute;
      z-index: 2;
      background: rgba(33,150,243 ,1);
      color: #fff;
      top: 110%;
      padding: 8px 16px;
    }
  }
</style>
