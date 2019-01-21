<template>
  <div class="game-deck" @mouseover="onMouseOver" @mouseout="onMouseOut">
    <transition-group name="game-deck" tag="div">
      <CardFlip
        v-for="(card, index) in deck"
        :key="index"
        :flipped="isCardFlipped(card)"
        :card="card"
        :style="{
          transform: getOffset(card, index),
          transition: 'all .75s ease',
          'z-index': index + 1,
          'transition-delay': initialLoad ? `${index * 10 / 1000}s` : '0s'
        }"
        class="game-deck__card"
        @cardClick="getCard"
      ></CardFlip>
    </transition-group>
    <Button
      v-if="showEnd"
      type="blue"
      size="big"
      :text="$text('NOTIFICATIONS.GAME.END_SEE_THE_FUTURE')"
      class="game-deck__button"
      @buttonClick="endSeeTheFuture"
    />
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
        showEnd: false,
        showDeck: false,
        initialLoad: true,
      };
    },

    created() {
      this.$store.getters.socket.emit('getDeck', {
        roomId: this.$route.params.id,
      }, this.updateDeck);
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
      this.$store.getters.socket.on('seeTheFuture', (cards) => {
        console.log('seeTheFuture', cards);
        this.deck.splice(-3, 3, ...cards);
        this.showEnd = true;
      });
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

      onMouseOver(event) {
        if (event.shiftKey) {
          this.showDeck = true;
        }
      },

      onMouseOut() {
        this.showDeck = false;
      },

      isCardFlipped(card) {
        return !card.props;
      },

      getOffset(card, index) {
        return `translate(${this.cardOffsetX(card, index)}px, ${this.cardOffsetY(card, index)}px)`;
      },

      cardOffsetX(card, index) {
        return this.isCardFlipped(card)
               ? (this.showDeck ? 15 : -1) * index
               : 212 * (4 - (this.deck.length - index));
      },

      cardOffsetY(card, index) {
        return -2 * index;
      },

      endSeeTheFuture() {
        this.$store.getters.socket.emit('endSeeTheFuture', {
          roomId: this.$route.params.id,
        });
        this.showEnd = false;
      },

      getCard() {
        this.$store.getters.socket.emit('playerGetCard', {
          roomId: this.$route.params.id,
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
    left: 100px;
    top: calc(40% - 200px);

    &__card {
      position: absolute;
    }

    &__button {
      left: 320px;
      bottom: calc(50vh - 140px);
      position: fixed;
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
