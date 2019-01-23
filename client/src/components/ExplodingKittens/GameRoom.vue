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
    <Console />
  </div>
</template>

<script>
  import GameUI          from './GameUI';
  import Console         from './Console';
  import personalizeText from '../../assets/utils/personalizeText';

  export default {
    name: 'GameRoom',
    components: {
      GameUI,
      Console,
    },

    data() {
      return {
        players: [],
        state: 'joined',
        roomExist: false,
        gameStarted: false,
        lastShiftTime: null,
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
      this.$store.getters.socket.on('gameMessage', this.onGameMessage);
      this.$store.getters.socket.on('playerUseFavor', this.onFavor);
      this.$store.getters.socket.on('startActionTimer', this.onStartActionTimer);

      document.body.addEventListener('keyup', this.onKeyUp);
    },

    beforeDestroy() {
      this.$store.getters.socket.off('gameStatus', this.onGameStatus);
      this.$store.getters.socket.off('gameStart', this.onGameStart);
      this.$store.getters.socket.off('gameMessage', this.onGameMessage);
      this.$store.getters.socket.off('playerUseFavor', this.onFavor);
      this.$store.getters.socket.off('startActionTimer', this.onStartActionTimer);

      document.body.removeEventListener('keyup', this.onKeyUp);
    },

    methods: {
      joinRoom() {
        this.roomExist = true;
        this.$store.getters.socket.emit('playerJoin', {
          name: this.$store.getters.player.name,
          roomId: this.$route.params.id
        });
      },

      onGameStatus(playersList) {
        console.log('player list update');
        this.players = playersList;
        this.updateState();
      },

      onGameStart() {
        console.log('game start event', this.gameStarted);

        if (this.gameStarted) {
          return;
        }

        this.gameStart(true);
      },

      onGameMessage(message) {
        this.$root.$emit('showMessage', {
          text: this.$text(
            personalizeText(message.text, message.options.player, this.$store.getters.player.name),
            message.options,
          ),
        });
      },

      onFavor() {
        console.log('favooor');
        this.$root.$emit('showMessage', {
          text: 'Вибери карту та зроби ласку',
        });
      },

      onStartActionTimer({ time, cards, actionEnabled }) {
        console.log('start action timer');
        const actions = [];

        if (actionEnabled) {
          actions.push({
            text: this.$text('NOTIFICATIONS.GAME.NOPE'),
            type: 'red',
            size: 'medium',

            action() {
              console.log('stooop!!');
              this.$store.getters.socket.emit('stopAction', {
                roomId: this.$route.params.id,
                name: this.$store.getters.player.name
              });
              this.$root.$emit('hideDialog');
            }
          });
        }

        this.$root.$emit('showDialog', {
          time,
          actions,
          title: this.$text('NOTIFICATIONS.GAME.PLAYER_USE_CARD', {
            card: this.$text(cards[0].props.name)
          }),
          text: this.$text('NOTIFICATIONS.GAME.TIME_TO_STOP'),

          onEnd() {
            console.log('end');
            this.$root.$emit('hideDialog');
          },
        })
      },

      gameStart(start) {
        if (start) {
          console.log('show notification', start);
          this.$root.$emit('showMessage', {
            text: this.$text('NOTIFICATIONS.GAME_STARTED.TITLE'),
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

      onKeyUp(event) {
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          const now = performance.now();

          if (this.lastShiftTime && now - this.lastShiftTime < 200) {
            this.$root.$emit('showConsole');
          } else {
            this.lastShiftTime = now;
          }
        }
      },
    },
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
