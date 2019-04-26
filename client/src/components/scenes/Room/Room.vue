<template>
  <div class="Room">
    <div class="Room__wrapper">
      <div class="Room__title">{{ $text('GAME_ROOMS.PLAYERS') }}</div>
      <div class="Room__playersContainer">
        <transition-group name="player">
          <div v-for="player in players" :key="player.name" class="Room__player">
            <div class="Room__playerName">{{ player.name }}</div>
            <div
              :class="{ 'Room__playerStatus': true, 'Room__playerStatus--ready': player.ready }"
            ></div>
          </div>
        </transition-group>
      </div>
    </div>
    <ReadyBlock :ready="playerReady" @ready="ready" />
    <div class="Room__wrapper">
      <div class="Room__title">{{ $text('GAME_ROOMS.GAME_SETTINGS') }}</div>
      <div class="Room__cardsContainer">
        <div class="Room__cardsTitle">
          {{ $text('GAME_ROOMS.CARDS_LIST') }}:
        </div>
        <div class="Room__cardsWrapper">
          <transition-group name="cards">
            <CardIcon
              v-for="card in cards"
              :key="card.name"
              :name="card.name"
              size="small"
              class="Room__card"
              @iconClick="cardClick(card)"
            />
          </transition-group>
        </div>
        <div v-if="settings" class="Room__options">
          <div v-for="option in settings.options" v-if="option.selected" class="Room__option">
            {{ $text(option.label) }}
          </div>
        </div>
      </div>
    </div>
    <CardDescription />
  </div>
</template>

<script>
  import Socket from '../../../entities/Socket';
  import CardIcon from '../Game/CardIcon';
  import room from '../../../assets/mixins/room';
  import ReadyBlock from './ReadyBlock';
  import CardDescription from '../Game/CardDescription';

  export default {
    name: 'Room',
    components: {
      ReadyBlock,
      CardIcon,
      CardDescription,
    },
    mixins: [
      room,
    ],

    data() {
      return {
        players: [],
        cards: [],
        settings: {},
      }
    },

    computed: {
      playerReady() {
        const player = this.players.find(player => player.name === this.$store.getters.player.name);

        if (player) {
          return player.ready;
        }

        return true;
      }
    },

    created() {
      Socket.on('gameStatus', this.onGameStatus);
      Socket.on('gameStart', this.onGameStart);
    },

    beforeDestroy() {
      Socket.off('gameStatus', this.onGameStatus);
      Socket.off('gameStart', this.onGameStart);
    },

    methods: {
      onGameStatus({ players, cards, settings }) {
        this.players = players;
        this.settings = settings;

        console.log(cards);
        const cardsToAdd = [...cards];

        if (this.cards.length) {
          return;
        }

        const intervalId = setInterval(() => {
          if (cardsToAdd.length) {
            this.cards.push(cardsToAdd.shift());
          } else {
            clearInterval(intervalId);
          }
        }, 80);
      },

      onGameStart() {
        this.$router.push(`/room/${this.$route.params.id}/game`);
      },

      ready() {
        this.player().ready(this.$route.params.id);
      },

      cardClick(card) {
        this.$root.$emit('showCardDescription', card.name);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Room {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 20px;

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 600px;
      padding: 20px;
      border-radius: 5px;
      background: #37474F;
      box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, .4);
      overflow: hidden;
    }

    &__title {
      margin-bottom: 10px;
      color: #fff;
      font-size: 32px;
      text-align: center;
    }

    &__options {
      display: flex;
      margin-top: 10px;
    }

    &__option {
      margin-right: 10px;
      padding: 4px 6px;
      border-radius: 3px;
      background: rgba(25,118,210 ,1);
      color: #fff;
      font-size: 12px;
      line-height: 1;
    }

    &__cardsWrapper {
      display: flex;
      flex-wrap: wrap;
      color: #fff;
    }

    &__cardsTitle {
      margin-bottom: 8px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }

    &__card {
      display: inline-flex;
      margin: 6px;
      cursor: pointer;
    }

    .cards-enter,
    .cards-enter-active {
      animation: card-in .1s ease-in forwards;
    }

    .cards-leave,
    .cards-leave-active {
      animation: card-out .1s ease-out forwards;
    }

    @keyframes card-in {
      0% {
        opacity: 0;
        transform: translate(0, 18px);
        margin-bottom: -18px;
      }

      100% {
        opacity: 1;
        transform: translate(0, 0);
        margin-bottom: 4px;
      }
    }

    &__playersContainer {
      display: flex;
      flex-direction: column;
      width: 500px;
    }

    &__player {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      color: #fff;
      font-size: 28px;
    }

    &__playerStatus {
      width: 32px;
      height: 32px;
      background: url('../../../assets/img/not-ready.png') no-repeat center;

      &--ready {
        background: url('../../../assets/img/ready.png') no-repeat center;
      }
    }

    .player-enter,
    .player-enter-active {
      animation: player-in .5s ease-in forwards;
    }

    .player-leave,
    .player-leave-active {
      animation: player-out .5s ease-out forwards;
    }

    @keyframes player-in {
      0% {
        opacity: 0;
        transform: translate(0, 18px);
        margin-bottom: -48px;
      }

      100% {
        opacity: 1;
        transform: translate(0, 0);
        margin-bottom: 16px;
      }
    }
  }
</style>
