<template>
  <div class="game-room__wrapper">
    <GameUI v-show="gameStarted" />
    <div v-if="!gameStarted" class="game-room">
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
      this.$store.getters.socket.emit(
        'knockKnock',
        {
          roomId: this.$route.params.id
        },
        (exist) => {
          if (exist) {
            this.joinRoom();
          }
        }
      );

      this.$store.getters.socket.on('gameStatus', this.onGameStatus);
      this.$store.getters.socket.on('gameStart', this.onGameStart);
      this.$store.getters.socket.on('playerMove', this.onPlayerMove);
      this.$store.getters.socket.on('playerExploded', this.onPlayerExploded);
      this.$store.getters.socket.on('playerDefuseExplodingKitten', this.onPlayerDefuseExplodingKitten);
      this.$store.getters.socket.on('playerWin', this.onPlayerWin);

      // setTimeout(() => {
      //   this.$root.$emit('showDialog', {
      //     title: this.$text('NOTIFICATIONS.GAME.EXPLODING_DIALOG.TITLE'),
      //     text: this.$text('NOTIFICATIONS.GAME.EXPLODING_DIALOG.TEXT'),
      //     actions: [
      //       {
      //         text: this.$text('NOTIFICATIONS.GAME.DEFUSE'),
      //         description: this.$text(''),
      //         type: 'green',
      //         size: 'medium',
      //
      //         action() {},
      //       },
      //     ],
      //     time: 30 * 1000,
      //
      //     onEnd() {
      //       this.$root.$emit('hideDialog');
      //       this.$store.getters.socket.emit('playerExploded');
      //     }
      //   });
      // }, 8000);
    },

    beforeDestroy() {
      this.$store.getters.socket.off('gameStatus', this.onGameStatus);
      this.$store.getters.socket.off('gameStart', this.onGameStart);
      this.$store.getters.socket.off('playerMove', this.onPlayerMove);
      this.$store.getters.socket.off('playerExploded', this.onPlayerExploded);
      this.$store.getters.socket.off('playerDefuseExplodingKitten', this.onPlayerDefuseExplodingKitten);
      this.$store.getters.socket.off('playerWin', this.onPlayerWin);
    },

    methods: {
      joinRoom() {
        this.roomExist = true;
        this.$store.getters.socket.emit('playerJoin', {
          name: this.$store.getters.player.name,
          roomId: this.$route.params.id
        });

        this.$store.getters.socket.emit(
          'getGameStatus',
          {
            roomId: this.$route.params.id
          },
          (started) => {
            console.log('game start event callback', started);
            this.gameStart(started);
          }
        );
      },

      onGameStatus(playersList) {
        console.log('player list update');
        this.players = playersList;
        this.updateState();
      },

      onGameStart() {
        console.log('game start event', this.gameStarted, this._uid);
        console.log(this.$el, this._uid);

        if (this.gameStarted) {
          return;
        }

        this.gameStart(true);
      },

      onPlayerMove(name) {
        console.log('player move', name);

        if (name === this.$store.getters.player.name) {
          this.$root.$emit('showNotification', {
            title: this.$text('NOTIFICATIONS.GAME.YOUR_TURN.TITLE'),
          });
        }
      },

      onPlayerExploded() {
        console.log('player Exploded');
        // this.$root.$emit('showDialog', {
        //   title: this.$text('NOTIFICATIONS.GAME.EXPLODING_DIALOG.TITLE'),
        //   text: this.$text('NOTIFICATIONS.GAME.EXPLODING_DIALOG.TEXT'),
        //   actions: [
        //     {
        //       text: this.$text('NOTIFICATIONS.GAME.DEFUSE'),
        //       type: 'green',
        //       size: 'medium',
        //
        //       action() { },
        //     },
        //   ],
        //   time: 30 * 1000,
        //
        //   onEnd() {
        //     this.$root.$emit('hideDialog');
        //     this.$store.getters.socket.emit('playerExploded');
        //   },
        // });
        this.$root.$emit('showNotification', {
          title: this.$text('NOTIFICATIONS.GAME.YOU_EXPLODED.TITLE'),
        });
      },

      onPlayerDefuseExplodingKitten() {
        console.log('Player defuse kitten');
        this.$root.$emit('showNotification', {
          title: this.$text('NOTIFICATIONS.GAME.DEFUSE_WILL_BE_USED'),
        });
      },

      onPlayerWin() {
        console.log('Player Win!');
        this.$root.$emit('showNotification', {
          title: this.$text('NOTIFICATIONS.GAME.YOU_WIN.TITLE'),
        });
      },

      gameStart(start) {
        if (start) {
          console.log('show notification', start);
          this.$root.$emit('showNotification', {
            title: this.$text('NOTIFICATIONS.GAME_STARTED.TITLE'),
          });
        }

        this.gameStarted = start;
      },

      ready() {
        console.log('player ready');
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
