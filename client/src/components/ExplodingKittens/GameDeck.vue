<template>
  <div class="game-deck">
    <transition-group name="game-deck" tag="div" :duration="{ enter: 500, leave: 0 }">
      <CardFlip
        v-for="(card, index) in deck"
        :key="card.id"
        :flipped="isCardFlipped(card)"
        :card="card"
        :style="{
          transform: getOffset(card, index),
          transition: 'all .75s ease',
          'z-index': index + 1,
          'transition-delay': initialLoad ? `${index * 10 / 1000}s` : '.1s'
        }"
        class="game-deck__card"
        @cardClick="getCard"
      ></CardFlip>
    </transition-group>
    <div class="game-deck__count">
      {{ $text('NOTIFICATIONS.GAME.CARDS_COUNT') }}:
      {{ deck.length }}
    </div>
  </div>
</template>

<script>
  import CardFlip from './CardFlip';

  export default {
    name: 'GameDeck',
    components: {
      CardFlip,
    },

    data() {
      return {
        deck: [],
        initialLoad: true,
      };
    },

    created() {
      this.$store.getters.socket.emit('getGameUpdates', { roomId: this.$route.params.id });
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
    },

    methods: {
      updateDeck(deck) {
        this.deck = deck;
      },

      updateStats(gameData) {
        this.updateDeck(gameData.gameDeck);
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
        this.$store.getters.socket.emit('endSeeTheFuture', {
          roomId: this.$route.params.id,
        });
      },

      getCard() {
        this.$store.getters.socket.emit('playerGetCard', {
          roomId: this.$route.params.id,
          name: this.$store.getters.player.username,
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
