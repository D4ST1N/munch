<template>
  <div class="card-stack">
    <transition-group
      tag="div"
      class="card-stack__wrapper"
      :style="{ height: `${settingsData.height}px` }"
      name="card-stack"
    >
      <Card
        v-for="(card, index) in cards"
        :key="card.id"
        :index="index"
        :card="card"
        :count="cards.length"
        :width="width"
        @cardClick="cardClick"
      />
    </transition-group>
    <div v-if="numbered" class="card-stack__wrapper">
      <div
        v-for="cardIndex in cards.length"
        :key="`${cardIndex}number`"
        class="card-stack__number"
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
  import Card from './Card';

  export default {
    name: 'CardStack',
    components: {
      Card,
    },
    props: {
      cards: {
        type: Array,
      },
      areaWidth: {
        type: Number,
      },
      numbered: {
        type: Boolean,
        default: false,
      },
      changeOrder: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        width: this.areaWidth || this.$store.getters.settings.game.field.width - 40,
        settingsData: this.$store.getters.settings.game.cardSettings,
      };
    },

    methods: {
      getCardOffset(index) {
        if (this.static) {
          return 0;
        }

        const maxWidth = this.width;
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

      getCardStyles(index) {
        return {
          position: 'absolute',
          left: '50%',
          transform: `translate(${ this.getCardOffset(index) }px, 0)`
        };
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
      width: 150px;
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
