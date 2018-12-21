<template>
  <GameUI v-if="gameStarted" />
  <div v-else class="game-room">
    <div v-if="roomExist" class="game-room__content">
      <h2 class="game-room__players">{{ $text('GAME_ROOMS.PLAYERS') }}</h2>
      <div class="game-room__players-list">
        <div v-for="player in players" :id="player.name" class="game-room__player">
          <div class="game-room__player-name">{{ player.name }}</div>
          <div
            :class="{
              'game-room__player-state': true,
              'game-room__player-state--ready': player.ready
            }"
          ></div>
        </div>
      </div>
      <div v-if="state === 'joined'" class="game-room__action" @click="ready">{{ $text('GAME_ROOMS.READY') }}</div>
      <p v-else >{{ $text('GAME_ROOMS.WAIT') }}</p>
    </div>
    <div v-else class="game-room__content">
      <h2 class="game-room__players">{{ $text('GAME_ROOMS.NOT_EXIST') }}</h2>
      <router-link to="/exploding-kittens" class="game-room__action">
        {{ $text('GAME_ROOMS.GO_HOME') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import GameUI from './GameUI';

export default {
  name: 'GameRoom',
  components: {
    GameUI,
  },

  data() {
    return {
      players: [],
      state: 'joined',
      roomExist: false,
      gameStarted: false,
    };
  },

  created() {
    this.$store.getters.socket.emit('knockKnock', this.$route.params.id, (exist) => {
      if (exist) {
        this.roomExist = true;
        this.$store.getters.socket.emit('playerJoin', {
          name: this.$store.getters.player.name,
          roomId: this.$route.params.id,
        });

        this.$store.getters.socket.emit('getGameStatus', this.$route.params.id, (started) => {
          console.log('game start event callback', started);
          this.gameStarted = started;
        });
      }
    });

    this.$store.getters.socket.on('gameStatus', (playersList) => {
      this.players = playersList;
      this.updateState();
    });
    this.$store.getters.socket.on('gameStart', () => {
      console.log('game start event');
      this.gameStarted = true;
    });
  },

  methods: {
    ready() {
      this.$store.getters.socket.emit('playerReady', {
        name: this.$store.getters.player.name,
        roomId: this.$route.params.id,
      });
    },

    updateState() {
      const name = this.$store.getters.player.name;
      const player = this.players.find(player => player.name === name);

      if (player && player.ready) {
        this.state = 'ready';
      } else {
        this.state = 'joined';
      }
    },
  }
};
</script>

<style lang="scss">
  .game-room {
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
      display: inline-block;
      text-decoration: none;
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
