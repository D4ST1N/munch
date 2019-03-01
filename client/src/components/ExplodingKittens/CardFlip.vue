<template>
  <div
    :class="{
      'card-flip': true,
      'card-flip--playable': type === 'playerCard',
      'card-flip--selected': selected,
    }"
    :style="{ width: `${settings.width}px`, height: `${settings.height}px` }"
    @click="cardClick"
  >
    <div :class="{ 'card-flip__wrapper': true, 'card-flip__wrapper--flipped': flipped }">
      <div v-if="card.props" :class="cardContentClass">
        <div class="card-flip__border" :style="{ 'border-color': card.props.color }"></div>
        <div class="card-flip__card-content">
          <div class="card-flip__header">
            <div :class="cardIconClass"></div>
            <div class="card-flip__info">
              <div class="card-flip__name">{{ $text(card.props.name) }}</div>
              <div class="card-flip__legend"></div>
            </div>
          </div>
          <div class="card-flip__background-wrapper">
            <div class="card-flip__picture"></div>
            <div class="card-flip__description"></div>
          </div>
          <div class="card-flip__header card-flip__header--inverse">
            <div :class="cardIconClass"></div>
            <div class="card-flip__info">
              <div class="card-flip__name">{{ $text(card.props.name) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-flip__content card-flip__content--back"></div>
    </div>
  </div>
</template>

<script>
  import settings from './settings';

  export default {
    name: 'CardFlip',
    props: {
      card: Object,
      type: {
        type: String,
        default: '',
      },
      custom: {
        type: Object,
      },
      selected: {
        type: Boolean,
        default: false,
      },
      flipped: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        settings: this.custom || settings.card,
      };
    },

    computed: {
      cardContentClass() {
        return {
          'card-flip__content': true,
          [`card-flip__content--${this.card.props.type}`]: true,
        };
      },

      cardIconClass() {
        return {
          'card-flip__icon': true,
          [`card-flip__icon--${this.card.props.type}`]: true,
        };
      }
    },

    methods: {
      cardClick(event) {
        if (event.ctrlKey) {
          this.$root.$emit('showCardDescription', this.card);
        } else {
          this.$emit('cardClick', this.card);
        }
      },
    },
  };
</script>

<style lang="scss">
  .card-flip {
    position: relative;
    perspective: 600px;
    transition: all .375s ease;
    width: 200px;
    height: 280px;
    cursor: pointer;
    top: 0;

    &--playable {
      &:hover {
        z-index: 100;

        .card-flip__wrapper {
          transform: scale(1.075);
        }
      }
    }

    &--selected {
      top: -20px;
    }

    &__wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      transition: transform .375s;
      transform-style: preserve-3d;
      transform-origin: 50% 100%;

      &--flipped {
        transform: rotateY(180deg);
      }
    }

    &__content {
      position: absolute;
      height: 100%;
      width: 100%;
      backface-visibility: hidden;
      padding: 14px;
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(38,50,56 ,.4);
      background: #fff;

      &--skip {
        background: url(../../assets/img/cards/small/skip.jpg) no-repeat center/cover;
      }

      &--nope {
        background: url(../../assets/img/cards/small/nope.jpg) no-repeat center/cover;
      }

      &--see-the-future,
      &--see-the-future-x5 {
        background: url(../../assets/img/cards/small/see-the-future.jpg) no-repeat center/cover;
      }

      &--attack {
        background: url(../../assets/img/cards/small/attack.jpg) no-repeat center/cover;
      }

      &--defuse {
        background: url(../../assets/img/cards/small/defuse.jpg) no-repeat center/cover;
      }

      &--exploding-kitten {
        background: url(../../assets/img/cards/small/exploding-kitten.jpg) no-repeat center/cover;

        .card-flip__name {
          opacity: 0;
        }
      }

      &--shuffle {
        background: url(../../assets/img/cards/small/shuffle.jpg) no-repeat center/cover;
      }

      &--favor {
        background: url(../../assets/img/cards/small/favor.jpg) no-repeat center/cover;
      }

      &--beard-cat {
        background: url(../../assets/img/cards/small/beard-cat.jpg) no-repeat center/cover;
      }

      &--burrito-cat {
        background: url(../../assets/img/cards/small/burrito-cat.jpg) no-repeat center/cover;
      }

      &--rainbow-cat {
        background: url(../../assets/img/cards/small/rainbow-cat.jpg) no-repeat center/cover;
      }

      &--potato-cat {
        background: url(../../assets/img/cards/small/potato-cat.jpg) no-repeat center/cover;
      }

      &--watermelon-cat {
        background: url(../../assets/img/cards/small/watermelon-cat.jpg) no-repeat center/cover;
      }

      &--get-lower {
        background: url(../../assets/img/cards/small/get-lower.jpg) no-repeat center/cover;
      }

      &--wild-cat {
        background: url(../../assets/img/cards/small/wild-cat.jpg) no-repeat center/cover;
      }

      &--reverse {
        background: url(../../assets/img/cards/small/reverse.jpg) no-repeat center/cover;
      }

      &--attack-target {
        background: url(../../assets/img/cards/small/attack-target.jpg) no-repeat center/cover;
      }

      &--change-the-future,
      &--change-the-future-x5 {
        background: url(../../assets/img/cards/small/change-the-future.jpg) no-repeat center/cover;
      }

      &--imploding-kitten {
        background: url(../../assets/img/cards/small/imploding-kitten.jpg) no-repeat center/cover;

        .card-flip__name {
          opacity: 0;
        }
      }

      &--back {
        background: url('../../assets/img/card-cover.png') no-repeat center/cover;
        transform: rotateY(180deg);
      }
    }

    &__border {
      position: absolute;
      width: calc(100% - 12px);
      height: calc(100% - 12px);
      top: 6px;
      left: 6px;
      border: 4px solid #ccc;
      border-radius: 4px;
    }

    &__card-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      position: absolute;
      padding: 4px;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      top: 8px;
      left: 8px;
    }

    &__header {
      display: flex;
      text-transform: uppercase;

      &--inverse {
        transform: rotate(180deg);
      }
    }

    &__icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(176,190,197 ,1);
      margin-right: 4px;

      &--skip {
        background: url(../../assets/img/icons/small/skip.png) no-repeat center/cover;
      }

      &--nope {
        background: url(../../assets/img/icons/small/nope.png) no-repeat center/cover;
      }

      &--see-the-future,
      &--see-the-future-x5 {
        background: url(../../assets/img/icons/small/see-the-future.png) no-repeat center/cover;
      }

      &--attack {
        background: url(../../assets/img/icons/small/attack.png) no-repeat center/cover;
      }

      &--defuse {
        background: url(../../assets/img/icons/small/defuse.png) no-repeat center/cover;
      }

      &--favor {
        background: url(../../assets/img/icons/small/favor.png) no-repeat center/cover;
      }

      &--rainbow-cat {
        background: url(../../assets/img/icons/small/rainbow-cat.png) no-repeat center/cover;
      }

      &--shuffle {
        background: url(../../assets/img/icons/small/shuffle.png) no-repeat center/cover;
      }

      &--burrito-cat {
        background: url(../../assets/img/icons/small/burrito-cat.png) no-repeat center/cover;
      }

      &--beard-cat {
        background: url(../../assets/img/icons/small/beard-cat.png) no-repeat center/cover;
      }

      &--watermelon-cat {
        background: url(../../assets/img/icons/small/watermelon-cat.png) no-repeat center/cover;
      }

      &--potato-cat {
        background: url(../../assets/img/icons/small/potato-cat.png) no-repeat center/cover;
      }

      &--get-lower {
        background: url(../../assets/img/icons/small/get-lower.png) no-repeat center/cover;
      }

      &--wild-cat {
        background: url(../../assets/img/icons/small/wild-cat.png) no-repeat center/cover;
      }

      &--reverse {
        background: url(../../assets/img/icons/small/reverse.png) no-repeat center/cover;
      }

      &--attack-target {
        background: url(../../assets/img/icons/small/attack-target.png) no-repeat center/cover;
      }

      &--change-the-future,
      &--change-the-future-x5 {
        background: url(../../assets/img/icons/small/change-the-future.png) no-repeat center/cover;
      }

      &--imploding-kitten {
        background: #000;
      }

      &--exploding-kitten {
        background: transparent;
      }
    }

    &__info {
      max-width: calc(100% - 34px);
      padding: 4px 0;
    }

    &__name {
      font-size: 10px;
      font-weight: bold;
    }

    &__background-wrapper {
      text-align: center;
      display: flex;
      align-items: center;
      flex-grow: 1;
      padding: 0 4px;
    }

    &__description {
      font-size: 10px;
    }
  }
</style>
