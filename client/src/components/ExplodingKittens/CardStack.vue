<template>
  <div class="card-stack">
    <transition-group
      ag="div"
      class="card-stack__wrapper"
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
        position: static ? 'static' : 'absolute',
        left: '50%',
        transform: `translate(${getCardOffset(index)}px, 0)`
      }"
        @cardClick="cardClick"
      ></CardFlip>
    </transition-group>
    <div v-if="numbered" class="card-stack__wrapper">
      <div
        v-for="cardIndex in cards.length"
        :key="`${cardIndex}number`"
        class="card-stack__number"
        :style="{
        transform: `translate(${getCardOffset(cardIndex)}px, 0)`
      }"
      >
        <Button
          v-if="changeOrder"
          class="card-stack__number-arrow card-stack__number-arrow--left"
          size="small"
          type="transparent"
          :squash="true"
          :disabled="cardIndex === 1"
          @buttonClick="leftClick(cardIndex)"
        >
          <Icon slot="before" type="back" size="small"></Icon>
        </Button>
        {{ cardIndex }}
        <Button
          v-if="changeOrder"
          class="card-stack__number-arrow card-stack__number-arrow--right"
          size="small"
          type="transparent"
          :squash="true"
          :disabled="cardIndex === cards.length"
          @buttonClick="rightClick(cardIndex)"
        >
          <Icon slot="before" type="forward" size="small"></Icon>
        </Button>
      </div>
    </div>
  </div>
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
      static: {
        type: Boolean,
        default: false,
      },
      areaWidth: {
        type: Number,
        default: window.innerWidth - 40,
      },
      numbered: {
        type: Boolean,
        default: false,
      },
      changeOrder: {
        type: Boolean,
        default: false,
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
        if (this.static) {
          return 0;
        }

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

      leftClick(index) {
        this.$emit('leftClick', this.cards[index - 1], index - 1);
      },

      rightClick(index) {
        this.$emit('rightClick', this.cards[index - 1], index - 1);
      },
    },
  };
</script>

<style lang="scss">
  .card-stack {
    display: flex;
    flex-direction: column;

    &__wrapper {
      display: flex;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    &__number {
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
    }

    &__number-arrow {
      &--right {
        margin-left: 8px;
      }
    }

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
