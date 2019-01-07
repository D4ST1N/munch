<template>
  <div
    :class="{
      'card': true,
      'card--inverted': card.inverted,
      'card--playable': type === 'playerCard',
    }"
    :style="{ width: `${settings.card.width}px`, height: `${settings.card.height}px` }"
    @click="cardClick"
  >
    <div
      v-if="!card.inverted"
      :class="{ 'card__wrapper': true, 'card__wrapper--selected': selected }"
    >
      <div class="card__header">
        <div class="card__icon"></div>
        <div class="card__info">
          <div class="card__name">{{ $text(card.props.name) }}</div>
          <div class="card__legend"></div>
        </div>
      </div>
      <div class="card__content">
        <div class="card__picture"></div>
        <div class="card__description">{{ $text(card.props.description) }}</div>
      </div>
      <div class="card__header card__header--inverse">
        <div class="card__icon"></div>
        <div class="card__info">
          <div class="card__name">{{ $text(card.props.name) }}</div>
        </div>
      </div>
      <div class="card__border" :style="{ 'border-color': card.props.color }"></div>
    </div>
    <div class="card__wrapper card__wrapper--back"></div>
  </div>
</template>

<script>
  import settings from './settings';

  export default {
    name: 'Card',
    props: {
      card: Object,
      type: {
        type: String,
        default: '',
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        settings,
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
  .card {
    background: #fff;
    border-radius: 5px;
    margin: 8px;
    position: relative;
    box-shadow: 0 0 0 1px rgba(38,50,56 ,.4);
    cursor: pointer;
    perspective: 600px;
    transition: all .375s ease;

    &--inverted {
      background: url('../../assets/img/card-cover.jpg') no-repeat center;
    }

    &--playable {
      position: absolute;
      left: 50%;
      margin: 0;

      &:hover {
        z-index: 100;
      }
    }

    &__wrapper {
      padding: 18px;
      display: flex;
      flex-direction: column;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 0 1px rgba(38,50,56 ,.4);
      justify-content: space-between;
      transform-origin: 50% 100%;
      transition: all .5s ease;
      transform-style: preserve-3d;
      backface-visibility: hidden;

      &:hover {
        transform: scale(1.10);
      }

      &--selected {
        &::after {
          content: '';
          position: absolute;
          width: 64px;
          height: 64px;
          top: calc(50% - 32px);
          left: calc(50% - 32px);
          border-radius: 50%;
          background: #fff url("../../assets/img/checked-symbol.png") no-repeat center;
          box-shadow: 0 0 8px 0 rgba(255, 255, 255, .6);
        }
      }

      &--back {
        transform: rotateY( 180deg );
      }
    }

    &__border {
      position: absolute;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      left: 8px;
      top: 8px;
      border-width: 3px;
      border-style: solid;
      border-radius: 4px;
    }

    &__header {
      display: flex;
      text-transform: uppercase;

      &--inverse {
        transform: rotate(180deg);
      }
    }

    &__icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(176,190,197 ,1);
      margin-right: 8px;
    }

    &__info {
      max-width: calc(100% - 40px);
    }

    &__name {
      font-size: 12px;
      font-weight: bold;
    }

    &__content {
      text-align: center;
    }

    &__description {
      font-size: 10px;
    }
  }
</style>
