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
        <Button
          v-if="state === 'joined'"
          class="game-room__action"
          type="green"
          :text="$text('GAME_ROOMS.READY')"
          @buttonClick="ready"
        />
        <p v-else >{{ $text('GAME_ROOMS.WAIT') }}</p>
      </div>
      <div v-else class="game-room__content">
        <h2 class="game-room__players">{{ $text('GAME_ROOMS.NOT_EXIST') }}</h2>
        <router-link to="/exploding-kittens" class="game-room__action">
          <Button size="small" type="green" :text="$text('GAME_ROOMS.GO_HOME')" />
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
        watchers: [],
        state: 'joined',
        roomExist: false,
        gameStarted: false,
        lastShiftTime: null,
      };
    },

    created() {
      this.$store.getters.socket.emit('knockKnock', {
        roomId: this.$route.params.id,
        event: 'roomStatus'
      });

      this.$store.getters.socket.on('roomStatus', this.onRoomStatus);
      this.$store.getters.socket.on('gameStatus', this.onGameStatus);
      this.$store.getters.socket.on('gameStart', this.onGameStart);
      this.$store.getters.socket.on('gameMessage', this.onGameMessage);
      this.$store.getters.socket.on('playerUseFavor', this.onFavor);
      this.$store.getters.socket.on('startActionTimer', this.onStartActionTimer);

      document.body.addEventListener('keyup', this.onKeyUp);
    },

    beforeDestroy() {
      this.$store.getters.socket.off('roomStatus', this.onRoomStatus);
      this.$store.getters.socket.off('gameStatus', this.onGameStatus);
      this.$store.getters.socket.off('gameStart', this.onGameStart);
      this.$store.getters.socket.off('gameMessage', this.onGameMessage);
      this.$store.getters.socket.off('playerUseFavor', this.onFavor);
      this.$store.getters.socket.off('startActionTimer', this.onStartActionTimer);

      document.body.removeEventListener('keyup', this.onKeyUp);
    },

    watch: {
      '$route'(to, from) {
        console.log(to, from);
      },
    },

    beforeRouteUpdate(to, from, next) {
      console.log(to, from);
      next();
    },

    methods: {
      onRoomStatus({ exist }) {
        if (exist) {
          this.joinRoom();
        }
      },

      joinRoom() {
        this.roomExist = true;
        this.$store.getters.socket.emit('playerJoin', {
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id
        });
      },

      onGameStatus({ players, watchers }) {
        console.log('player list update');
        console.log(players);
        this.players = players;
        this.watchers = watchers;
        this.updateState();
      },

      onGameStart({ players }) {
        console.log('game start event', this.gameStarted);

        if (this.gameStarted) {
          this.$store.commit('updatePlayerStatus', false);

          return;
        }

        if (players) {
          console.log(players);
          const isPlayer = !!players.find(
            player => player.name === this.$store.getters.player.username
          );

          this.$store.commit('updatePlayerStatus', isPlayer);
        }

        this.gameStart(true);
      },

      onGameMessage(message) {
        this.$root.$emit('showMessage', {
          text: message.options && message.options.personalized !== false
            ? this.$text(
              personalizeText(
                message.text,
                message.options.player,
                this.$store.getters.player.username
              ),
              message.options)
            : this.$text(message.text, message.options),
        });
      },

      onFavor({ name, actionEnabled }) {
        console.log('favooor');
        const title = this.$text('NOTIFICATIONS.GAME.CHOOSE_CARD_FOR_FAVOR', {
          player: name,
        });
        this.$root.$emit('showMessage', {
          text: title,
        });

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
                name: this.$store.getters.player.username
              });
              this.$root.$emit('hideDialog');
            }
          });
        }

        this.$root.$emit('showDialog', {
          actions,
          title,
          time: 0,
          text: this.$text('NOTIFICATIONS.GAME.YOU_CAN_STOP'),
        });
        this.$root.$on('playerMove', () => {
          this.$root.$emit('hideDialog');
        });
      },

      onStartActionTimer({ time, title, text, options, actionEnabled }) {
        console.log('start action timer');
        const actions = [];

        Object.entries(options).forEach(([key, value]) => {
          if (typeof value === 'string') {
            options[key] = this.$text(value);
          }
        });

        if (actionEnabled) {
          actions.push({
            text: this.$text('NOTIFICATIONS.GAME.NOPE'),
            type: 'red',
            size: 'medium',

            action() {
              console.log('stooop!!');
              this.$store.getters.socket.emit('stopAction', {
                roomId: this.$route.params.id,
                name: this.$store.getters.player.username
              });
              this.$root.$emit('hideDialog');
            }
          });
        }

        this.$root.$emit('showDialog', {
          time,
          actions,
          title: this.$text(title, options),
          text: this.$text(text),

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
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id,
        });
      },

      updateState() {
        const name = this.$store.getters.player.username;
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

        if (event.code === 'Escape') {
          this.$root.$emit('hideConsole');
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
      text-decoration: none;
      margin: 16px 0;
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
