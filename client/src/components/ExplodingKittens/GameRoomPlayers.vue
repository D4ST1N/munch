<template>
  <div class="game-room-players">
    <div
      v-for="player in players"
      :class="{
        'game-room-players__player': true,
        'game-room-players__player--current': isCurrent(player.name),
        'game-room-players__player--exploded': player.exploded,
      }"
    >
      <div class="game-room-players__player-name">{{ player.name }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameRoomPlayers',

    data() {
      return {
        players: [],
        playerName: this.$store.getters.player.name,
        current: '',
      };
    },

    created() {
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
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

    &__player {
      width: 128px;
      height: 128px;
      background: rgba(255,183,77 ,1);
      border-radius: 50%;
      border: 4px solid #fff;
      position: relative;
      margin: 16px;

      &--current {
        &::before,
        &::after {
          content: '';
          width: 22px;
          height: 44px;
          position: absolute;
          top: calc(100% + 16px);
          left: calc(50% - 22px);
          background: url("../../assets/img/arrow-up-1.png") no-repeat left;
        }

        &::after {
          left: 50%;
          background: url("../../assets/img/arrow-up-2.png") no-repeat right;
        }
      }

      &--exploded {
        &::before,
        &::after {
          content: '';
          width: 140%;
          height: 4px;
          position: absolute;
          top: calc(50% - 2px);
          left: -20%;
          background: rgb(69,90,100);
          transform-origin: 50% 50%;
          transform: rotate(45deg);
        }

        &::after {
          transform: rotate(-45deg);
        }
      }

      &-name {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 4px;
        border: 2px solid rgba(244,81,30 ,1);
        box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, .4);
        background: #fff;
        border-radius: 4px;
      }
    }
  }
</style>
