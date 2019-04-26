<template>
  <div class="game-deck">
    <transition-group name="game-deck" tag="div" :duration="{ enter: 500, leave: 0 }">
      <Card
        v-for="(card, index) in deck"
        :key="card.id"
        :card="card"
        :style="{
          transform: getOffset(card, index),
          transition: 'all .75s ease',
          'z-index': index + 1,
          'transition-delay': initialLoad ? `${ index * 10 / 1000 }s` : '.1s',
          'pointer-events': index === deck.length - 1 ? 'all' : 'none',
        }"
        @cardClick="getCard"
      />
    </transition-group>
    <div :style="{ top: `${ settings.game.cardSettings.height + 16 }px` }" class="game-deck__count">
      {{ $text('NOTIFICATIONS.GAME.CARDS_COUNT') }}:
      {{ deck.length }}
    </div>
    <div
      v-if="penaltyMoves > 0"
      :style="{ top: `${ settings.game.cardSettings.height + 36 }px` }"
      class="game-deck__count game-deck__count--penalty"
    >
      {{ $text('NOTIFICATIONS.GAME.PENALTY_COUNT') }}:
      {{ penaltyMoves }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Card from './Card';
  import Socket from '../../../entities/Socket';

  export default {
    name: 'GameDeck',
    components: {
      Card,
    },

    data() {
      return {
        deck: [],
        penaltyMoves: 0,
        initialLoad: true,
        roomId: this.$route.params.id,
      };
    },

    computed: {
      ...mapGetters([
        'settings',
      ]),
    },

    created() {
      Socket.emit('getGameUpdates', { roomId: this.roomId });
      Socket.on('gameUpdate', this.updateStats);
    },

    methods: {
      updateDeck(deck) {
        this.deck = deck;
      },

      updateStats(gameData) {
        this.updateDeck(gameData.gameDeck);
        this.penaltyMoves = gameData.penaltyMoves;

        setTimeout(() => {
          this.initialLoad = false;
        }, 2000);
      },

      isCardFlipped(card) {
        return !card.props;
      },

      getOffset(card, index) {
        return `translate(${this.cardOffsetX(card, index)}px, ${this.cardOffsetY(card, index)}px)`;
      },

      cardOffsetX(card, index) {
        return -0.25 * index + (card.props ? 10 : 0);
      },

      cardOffsetY(card, index) {
        return -0.5 * index;
      },

      endSeeTheFuture() {
        Socket.emit('endSeeTheFuture', {
          roomId: this.roomId,
        });
      },

      getCard() {
        Socket.emit('playerGetCard', {
          roomId: this.roomId,
          name: this.$store.getters.player.name,
        });

        this.$root.$emit('moveEnd');
      },
    },
  };
</script>

<style lang="scss">
  .game-deck {
    position: fixed;
    left: 220px;
    top: 120px;
    z-index: 1;

    &__card {
      position: absolute;
    }

    &__count {
      position: absolute;
      top: 230px;
      left: 0;
      color: #fff;
      white-space: nowrap;

      &--penalty {
        top: 250px;
      }
    }

    &-enter,
    &-leave-to {
      visibility: hidden;

      &-active {
        transition-duration: 0s;
      }
    }
  }
</style>
