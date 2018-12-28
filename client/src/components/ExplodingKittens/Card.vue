<template>
  <div
    :class="{ 'card': true, 'card--inverted': card.inverted }"
    @click="cardClick"
  >
    <div v-if="!card.inverted" :style="{ 'border-color': card.props.color }" class="card__wrapper">
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
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      card: Object,
    },

    methods: {
      cardClick() {
        this.$emit('cardClick');
      },
    },
  };
</script>

<style lang="scss">
  .card {
    background: #fff;
    width: 200px;
    min-width: 200px;
    height: 280px;
    border-radius: 5px;
    margin: 8px;
    position: relative;
    box-shadow: 0 0 0 1px rgba(38,50,56 ,.4);
    cursor: pointer;

    &--inverted {
      background: url('../../assets/img/card-cover.jpg') no-repeat center;
    }

    &__wrapper {
      padding: 10px;
      display: flex;
      flex-direction: column;
      position: absolute;
      width: calc(100% - 16px);
      height: calc(100% - 16px);
      left: 8px;
      top: 8px;
      border-width: 3px;
      border-style: solid;
      justify-content: space-between;
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
