<template>
  <div class="game-room-players">
    <div
      :class="{
        'game-room-players__container': true,
        'game-room-players__container--active': active
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
    <div v-if="active" class="game-room-players__label">
      {{ $text('NOTIFICATIONS.GAME.CHOOSE_PLAYER') }}
    </div>
    <div v-if="playerMove" class="game-room-players__label">
      {{ $text('NOTIFICATIONS.GAME.PLAYER_TURN.YOU') }}
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
        playerName: this.$store.getters.player.username,
        current: '',
        resolve: null,
        reject: null,
        active: false,
      };
    },

    computed: {
      playerMove() {
        return this.current === this.playerName;
      },
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
        this.players = players;
      },

      onChoosePlayer(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.active = true;
      },

      playerClick(player) {
        if (this.resolve) {
          this.resolve({ name: player.name });
          this.active = false;
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
    pointer-events: none;

    &__container {
      display: flex;
      pointer-events: all;

      &--active {
        background: rgba(207,216,220 ,1);
        box-shadow: 0 0 0 100vw rgba(38,50,56 ,.8);
      }
    }

    &__label {
      position: fixed;
      z-index: 2;
      background: var(--ui-player-current-label-background);
      color: var(--ui-player-current-label-color);
      top: 20px;
      left: 20px;
      padding: 8px 16px;
    }
  }
</style>
