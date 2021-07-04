<template>
  <div class="game-room-players">
    <div
      :class="{
        'game-room-players__container': true,
        'game-room-players__container--active': active
      }"
    >
      <div
        :class="{
          'game-room-players__direction': true,
          'game-room-players__direction--reversed': direction === 'left'
        }"
      ></div>
      <PlayerCircle
        v-for="player in players"
        :key="player.name"
        :name="player.name"
        :current="isCurrent(player.name)"
        :exploded="player.exploded"
        @playerClick="playerClick(player)"
      />
    </div>
    <div v-if="active" class="game-room-players__actions">
      <div class="game-room-players__label game-room-players__label--centered">
        {{ $text('NOTIFICATIONS.GAME.CHOOSE_PLAYER') }}
      </div>
      <Button type="red" size="small" :text="$text('NOTIFICATIONS.GAME.CANCEL')" @buttonClick="cancelAction"></Button>
    </div>
    <div
      :class="{
        'game-room-players__gradient': true,
        'game-room-players__gradient--green': playerMove
      }"></div>
  </div>
</template>

<script>
  import PlayerCircle from './PlayerCircle';
  import Socket from '../../../entities/Socket';

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
        resolve: null,
        reject: null,
        active: false,
        direction: 'right',
      };
    },

    computed: {
      playerMove() {
        return this.current === this.playerName;
      },
    },

    created() {
      Socket.on('gameUpdate', this.updateStats);
      this.$root.$on('choosePlayer', this.onChoosePlayer);
      this.$root.$on('gameUpdate', this.updateStats);
    },

    methods: {
      updateStats(gameData) {
        this.updatePlayersList(gameData.players);
        this.current = gameData.currentPlayer;
        this.direction = gameData.direction > 0 ? 'right' : 'left';

        if (this.playerMove && !this.$store.getters.focused) {
          this.$root.$emit('showNotification', {
            title: this.$text('NOTIFICATIONS.GAME.PLAYER_TURN.YOU'),
            options: {
              body: this.$text('PUSH.START_MOVE'),
              icon: '/kittens.png',
            },
          });
        }
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

        if (this.players.length === 2) {
          this.resolve({
            name: this.players.find(player => player.name !== this.playerName).name,
          });
        } else {
          this.active = true;
        }
      },

      playerClick(player) {
        if (this.resolve) {
          this.resolve({ name: player.name });
          this.active = false;
        }
      },

      cancelAction() {
        if (this.reject) {
          this.reject();
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none;

    &__container {
      display: flex;
      pointer-events: all;
      padding-bottom: 20px;

      &--active {
        background: rgba(207,216,220 ,1);
        box-shadow: 0 0 0 100vw rgba(38,50,56 ,.8);
      }
    }

    &__direction {
      width: 64px;
      height: 44px;
      background: url('../../../assets/img/direction-arrow.png') no-repeat center;
      margin-top: 58px;
      margin-right: 16px;
      transition: all .375s;

      &--reversed {
        transform: rotate(180deg);
      }
    }

    &__actions {
      pointer-events: all;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      position: relative;
      padding: 10px;
    }

    &__label {
      position: fixed;
      z-index: 2;
      background: var(--ui-player-current-label-background);
      color: var(--ui-player-current-label-color);
      top: 20px;
      left: 220px;
      padding: 8px 16px;

      &--centered {
        position: absolute;
        width: 140px;
        text-align: center;
        left: calc(50% - 70px);
        top: -20px;
        margin-right: 20px;
        font-size: 12px;
        padding: 4px 8px;
        background: rgba(25,118,210 ,1);
        border-radius: 0 0 10px 10px;
        color: #fff;
      }
    }

    &__gradient {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 10px solid rgba(244,67,54 ,1);
      z-index: -1;
      pointer-events: none;
      transition: all .5s ease;

      &--green {
        border: 10px solid rgba(67,160,71 ,1);
      }
    }
  }
</style>
