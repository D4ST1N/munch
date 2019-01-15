<template>
  <transition-group
    tag="div"
    class="card-stack"
    :style="{ height: `${settings.card.height}px` }"
    name="card-stack"
  >
    <CardFlip
      v-for="(card, index) in cards"
      :key="card.id"
      :card="card"
      :selected="isCardSelected(card.id)"
      :flipped="isCardFlipped(card)"
      :type="cardType"
      :style="{
        position: 'absolute',
        left: '50%',
        transform: `translate(${getCardOffset(index)}px, 0)`
      }"
      @cardClick="cardClick"
    ></CardFlip>
  </transition-group>
</template>

<script>
  import CardFlip from './CardFlip';
  import settings from './settings';

  export default {
    name: 'CardStack',
    components: {
      CardFlip,
    },
    props: {
      cards: {
        type: Array,
      },
      cardType: {
        type: String,
        default: 'playerCard'
      },
      selectedCards: {
        type: Array,

        default() {
          return [];
        },
      },
    },

    data() {
      return {
        settings,
      };
    },

    methods: {
      getCardOffset(index) {
        const maxWidth = window.innerWidth - 40;
        const cardCount = this.cards.length;
        const cardsWidth = cardCount * this.settings.card.width;
        const distancesWidth = (cardCount - 1) * this.settings.card.distance;
        const totalWidth = cardsWidth + distancesWidth;

        if (totalWidth < maxWidth) {
          return -totalWidth / 2 + index * (settings.card.width + this.settings.card.distance);
        }

        const cardSpace = (maxWidth - this.settings.card.width) / (cardCount - 1);

        return -maxWidth / 2 + index * cardSpace;
      },

      isCardSelected(id) {
        return !!this.selectedCards.find(card => card.id === id);
      },

      isCardFlipped(card) {
        return !card.props;
      },

      cardClick(card) {
        this.$emit('cardClick', card);
      }
    }
  };
</script>

<style lang="scss">
  .card-stack {

    &-enter,
    &-leave-to {
      opacity: 0;
      top: -120px;

      &-active {
        transition: all .5s ease;
      }
    }
  }
</style>
