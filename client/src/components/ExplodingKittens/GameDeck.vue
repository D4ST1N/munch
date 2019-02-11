<template>
  <div class="game-deck" @mouseover="onMouseOver" @mouseout="onMouseOut">
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
          'transition-delay': initialLoad ? `${index * 10 / 1000}s` : '0s'
        }"
        class="game-deck__card"
        @cardClick="getCard"
      ></CardFlip>
    </transition-group>
    <div v-if="showCount" class="game-deck__count">
      {{ $text('NOTIFICATIONS.GAME.CARDS_COUNT') }}:
      {{ deck.length }}
    </div>
    <div v-if="showEnd" class="game-deck__cards-indexes">
      <div v-for="index in 3" class="game-deck__index">{{ index }}</div>
    </div>
    <Button
      v-if="showEnd"
      type="blue"
      size="small"
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
        showCount: false,
      };
    },

    created() {
      this.$store.getters.socket.emit('getGameUpdates', { roomId: this.$route.params.id });
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
          this.showCount = true;
        }
      },

      onMouseOut() {
        this.showCount = false;
      },

      isCardFlipped(card) {
        return !card.props;
      },

      getOffset(card, index) {
        return `translate(${this.cardOffsetX(card, index)}px, ${this.cardOffsetY(card, index)}px) scale(${this.isCardFlipped(card) || !this.showEnd ? 1 : 0.85})`;
      },

      cardOffsetX(card, index) {
        return this.isCardFlipped(card) || !this.showEnd
               ? (this.showDeck ? 15 : -0.25) * index
               : -110 * (3 - (this.deck.length - index)) + 10;
      },

      cardOffsetY(card, index) {
        return this.isCardFlipped(card) || !this.showEnd ? -0.5 * index : 220;
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
          name: this.$store.getters.player.username,
        });

        this.$root.$emit('moveEnd');

        if (this.showEnd) {
          this.endSeeTheFuture();
        }
      },
    },
  };
</script>

<style lang="scss">
  .game-deck {
    position: fixed;
    left: 220px;
    top: 120px;

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

    &__cards-indexes {
      left: 20px;
      top: 560px;
      position: fixed;
      display: flex;
      width: 360px;
    }

    &__index {
      width: 33%;
      text-align: center;
      color: #fff;
    }

    &__button {
      left: 20px;
      top: 590px;
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
