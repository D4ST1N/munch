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
      <div v-if="card.props" class="card-flip__content card-flip__content--front">
        <div class="card-flip__border" :style="{ 'border-color': card.props.color }"></div>
        <div class="card-flip__card-content">
          <div class="card-flip__header">
            <div class="card-flip__icon" :style="{ background: card.props.color }"></div>
            <div class="card-flip__info">
              <div class="card-flip__name">{{ $text(card.props.name) }}</div>
              <div class="card-flip__legend"></div>
            </div>
          </div>
          <div class="card-flip__background-wrapper">
            <div class="card-flip__picture"></div>
            <div class="card-flip__description">{{ $text(card.props.description) }}</div>
          </div>
          <div class="card-flip__header card-flip__header--inverse">
            <div class="card-flip__icon" :style="{ background: card.props.color }"></div>
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

    methods: {
      cardClick() {
        this.$emit('cardClick', this.card);
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

      &--front {
        background: #fff;
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
      border-radius: 8px;
      background: rgba(176,190,197 ,1);
      margin-right: 4px;
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
