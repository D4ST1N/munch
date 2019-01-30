<template>
  <transition-group
    tag="div"
    class="card-stack"
    :style="{ height: `${settingsData.height}px` }"
    name="card-stack"
  >
    <CardFlip
      v-for="(card, index) in cards"
      :key="card.id"
      :card="card"
      :custom="settingsData"
      :selected="isCardSelected(card.id)"
      :flipped="isCardFlipped(card)"
      :type="getCardType(card)"
      :style="{
        position: relative ? 'relative' : 'absolute',
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
      type: {
        type: String,
        default: ''
      },
      cardType: {
        type: String,
        default: 'playerCard'
      },
      relative: {
        type: Boolean,
        default: false,
      },
      areaWidth: {
        type: Number,
        default: window.innerWidth - 40,
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
        settingsData: this.type === 'card-list' ? settings.cardInStack : settings.card,
      };
    },

    methods: {
      getCardOffset(index) {
        const maxWidth = this.areaWidth;
        const cardCount = this.cards.length;
        const cardsWidth = cardCount * this.settingsData.width;
        const distancesWidth = (cardCount - 1) * this.settingsData.distance;
        const totalWidth = cardsWidth + distancesWidth;

        if (totalWidth < maxWidth) {
          return -totalWidth / 2 + index * (this.settingsData.width + this.settingsData.distance);
        }

        const cardSpace = (maxWidth - this.settingsData.width) / (cardCount - 1);

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
      },

      getCardType(card) {
        return card.props ? 'playerCard' : 'regular';
      },
    },
  };
</script>

<style lang="scss">
  .card-stack {
    display: flex;

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
