<template>
  <div
    class="Card"
    :style="cardStyles"
    @click="cardClick"
  >
    <div
      :class="{
       'Card__wrapper': true,
       'Card__wrapper--focused': selected,
       'Card__wrapper--flipped': flipped,
       'Card__wrapper--hover': hover,
      }"
      :style="{
        'background-color': cardBackgroundColor,
        'border-color': cardBorderColor,
      }"
    >
      <div v-if="this.card.props" class="Card__content">
        <div class="Card__iconWrapper">
          <CardIcon :name="card.props.name" size="big" />
        </div>
        <div
          :class="{ 'Card__name': true, 'Card__name--fruit': card.props.isFruitCard }"
        >{{ $text(this.card.props.label) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CardIcon from './CardIcon';

  export default {
    name: 'Card',
    props: {
      card: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
      },
      index: {
        type: Number,
      },
      width: {
        type: Number,
      },
      hover: {
        type: Boolean,
        default: true,
      },
    },
    components: {
      CardIcon,
    },

    data() {
      return {
        settings: this.$store.getters.settings.game.cardSettings,
        flipped: !this.card.props,
      };
    },

    watch: {
      index() {
        this.$nextTick(() => {
          this.updatePosition();
        });
      },
      count() {
        this.updatePosition();
      }
    },

    computed: {
      selected() {
        return this.player().cardSelected(this.card.id);
      },

      cardBackgroundColor() {
        if (!this.card.props) {
          return ''
        }

        return this.card.props.isFruitCard ? '#fff' : this.card.props.color;
      },

      cardBorderColor() {
        if (!this.card.props) {
          return ''
        }

        return this.card.props.color;
      },

      cardStyles() {
        return {
          width: `${ this.settings.width }px`,
          height: `${ this.settings.height }px`,
          left: '50%',
        };
      },

      cardOffset() {
        const maxWidth = this.width;
        const cardCount = this.count;
        const cardsWidth = cardCount * this.settings.width;
        const distancesWidth = (cardCount - 1) * this.settings.distance;
        const totalWidth = cardsWidth + distancesWidth;

        if (totalWidth < maxWidth) {
          return -totalWidth / 2 + this.index * (this.settings.width + this.settings.distance);
        }

        const cardSpace = (maxWidth - this.settings.width) / (cardCount - 1);

        return -maxWidth / 2 + this.index * cardSpace;
      },
    },

    mounted() {
      this.updatePosition();
    },

    methods: {
      ...mapGetters([
        'player',
      ]),

      cardClick(event) {
        if (event.ctrlKey) {
          this.$root.$emit('showCardDescription', this.card.props.name);
        } else {
          this.$emit('cardClick', this.card);
        }
      },

      updatePosition() {
        this.$el.style.transform = `translate(${ this.cardOffset }px, 0)`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Card {
    position: absolute;
    top: 0;
    cursor: pointer;
    transition: all .375s ease;

    &:hover {
      z-index: 2;
    }

    &__wrapper {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      border-width: 4px;
      border-style: solid;
      box-shadow: 0 0 2px 0 rgba(80, 15, 1, .5);
      transform-origin: 50% 100%;
      transition: all .25s ease;

      &--flipped {
        background: rgb(160, 42, 17) url("../../../assets/img/pawprint.png") no-repeat center/50%;
        border-color: rgb(160, 42, 17);
      }

      &--hover:hover {
        transform: scale(1.1);
      }

      &--focused {
        transform: translate(0, -20px);

        &:hover {
          transform: translate(0, -20px) scale(1.1);
        }
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 6px;
    }

    &__iconWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50%;
    }

    &__name {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50%;
      color: #fff;
      text-transform: uppercase;
      text-align: center;
      font-size: 16px;

      &--fruit {
        color: #263238;
      }
    }
  }
</style>
