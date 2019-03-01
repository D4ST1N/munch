<template>
  <div v-if="show" class="card-description">
    <div class="card-description__wrapper">
      <div class="card-description__card">
        <div  :class="cardContentClass">
          <div class="card-description__border" :style="{ 'border-color': card.props.color }"></div>
          <div class="card-description__card-content">
            <div class="card-description__header">
              <div :class="cardIconClass"></div>
              <div class="card-description__info">
                <div class="card-description__name">{{ $text(card.props.name) }}</div>
                <div class="card-description__legend"></div>
              </div>
            </div>
            <div class="card-description__background-wrapper">
              <div class="card-description__picture"></div>
              <div class="card-description__description"></div>
            </div>
            <div class="card-description__header card-description__header--inverse">
              <div :class="cardIconClass"></div>
              <div class="card-description__info">
                <div class="card-description__name">{{ $text(card.props.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-description__description">
        <span class="card-description__description-text">
          {{ $text(card.props.description) }}
        </span>
        <Button :text="$text('NOTIFICATIONS.GAME.CLOSE')" @buttonClick="show = false" />
      </div>
    </div>
  </div>
</template>

<script>
  import CardFlip from './CardFlip';

  export default {
    name: 'CardDescription',
    components: {
      CardFlip,
    },

    data() {
      return {
        card: {},
        show: false,
      };
    },

    computed: {
      cardContentClass() {
        return {
          'card-description__content': true,
          [`card-description__content--${this.card.props.type}`]: true,
        };
      },

      cardIconClass() {
        return {
          'card-description__icon': true,
          [`card-description__icon--${this.card.props.type}`]: true,
        };
      }
    },

    created() {
      this.$root.$on('showCardDescription', (card) => {
        this.card = card;
        this.show = true;
      });
    }
  };
</script>

<style lang="scss">
  .card-description {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background: rgba(0,137,123 ,.4);

    &__wrapper {
      display: flex;
      flex-direction: column;
    }

    &__card {
      width: 614px;
      height: 800px;
      position: relative;
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
        background: url(../../assets/img/cards/big/skip.jpg) no-repeat center/cover;
      }

      &--nope {
        background: url(../../assets/img/cards/big/nope.jpg) no-repeat center/cover;
      }

      &--see-the-future,
      &--see-the-future-x5 {
        background: url(../../assets/img/cards/big/see-the-future.jpg) no-repeat center/cover;
      }

      &--attack {
        background: url(../../assets/img/cards/big/attack.jpg) no-repeat center/cover;
      }

      &--defuse {
        background: url(../../assets/img/cards/big/defuse.jpg) no-repeat center/cover;
      }

      &--exploding-kitten {
        background: url(../../assets/img/cards/big/exploding-kitten.jpg) no-repeat center/cover;

        .card-flip__name {
          opacity: 0;
        }
      }

      &--shuffle {
        background: url(../../assets/img/cards/big/shuffle.jpg) no-repeat center/cover;
      }

      &--favor {
        background: url(../../assets/img/cards/big/favor.jpg) no-repeat center/cover;
      }

      &--beard-cat {
        background: url(../../assets/img/cards/big/beard-cat.jpg) no-repeat center/cover;
      }

      &--burrito-cat {
        background: url(../../assets/img/cards/big/burrito-cat.jpg) no-repeat center/cover;
      }

      &--rainbow-cat {
        background: url(../../assets/img/cards/big/rainbow-cat.jpg) no-repeat center/cover;
      }

      &--potato-cat {
        background: url(../../assets/img/cards/big/potato-cat.jpg) no-repeat center/cover;
      }

      &--watermelon-cat {
        background: url(../../assets/img/cards/big/watermelon-cat.jpg) no-repeat center/cover;
      }

      &--get-lower {
        background: url(../../assets/img/cards/big/get-lower.jpg) no-repeat center/cover;
      }

      &--wild-cat {
        background: url(../../assets/img/cards/big/wild-cat.jpg) no-repeat center/cover;
      }

      &--reverse {
        background: url(../../assets/img/cards/big/reverse.jpg) no-repeat center/cover;
      }

      &--attack-target {
        background: url(../../assets/img/cards/big/attack-target.jpg) no-repeat center/cover;
      }

      &--change-the-future,
      &--change-the-future-x5 {
        background: url(../../assets/img/cards/big/change-the-future.jpg) no-repeat center/cover;
      }

      &--imploding-kitten {
        background: url(../../assets/img/cards/big/imploding-kitten.jpg) no-repeat center/cover;

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
      padding: 12px;
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
      width: 92px;
      height: 92px;
      border-radius: 50%;
      background: rgba(176,190,197 ,1);
      margin-right: 12px;

      &--skip {
        background: url(../../assets/img/icons/big/skip.png) no-repeat center/cover;
      }

      &--nope {
        background: url(../../assets/img/icons/big/nope.png) no-repeat center/cover;
      }

      &--see-the-future,
      &--see-the-future-x5 {
        background: url(../../assets/img/icons/big/see-the-future.png) no-repeat center/cover;
      }

      &--attack {
        background: url(../../assets/img/icons/big/attack.png) no-repeat center/cover;
      }

      &--defuse {
        background: url(../../assets/img/icons/big/defuse.png) no-repeat center/cover;
      }

      &--favor {
        background: url(../../assets/img/icons/big/favor.png) no-repeat center/cover;
      }

      &--rainbow-cat {
        background: url(../../assets/img/icons/big/rainbow-cat.png) no-repeat center/cover;
      }

      &--shuffle {
        background: url(../../assets/img/icons/big/shuffle.png) no-repeat center/cover;
      }

      &--burrito-cat {
        background: url(../../assets/img/icons/big/burrito-cat.png) no-repeat center/cover;
      }

      &--beard-cat {
        background: url(../../assets/img/icons/big/beard-cat.png) no-repeat center/cover;
      }

      &--watermelon-cat {
        background: url(../../assets/img/icons/big/watermelon-cat.png) no-repeat center/cover;
      }

      &--potato-cat {
        background: url(../../assets/img/icons/big/potato-cat.png) no-repeat center/cover;
      }

      &--get-lower {
        background: url(../../assets/img/icons/big/get-lower.png) no-repeat center/cover;
      }

      &--wild-cat {
        background: url(../../assets/img/icons/big/wild-cat.png) no-repeat center/cover;
      }

      &--reverse {
        background: url(../../assets/img/icons/big/reverse.png) no-repeat center/cover;
      }

      &--attack-target {
        background: url(../../assets/img/icons/big/attack-target.png) no-repeat center/cover;
      }

      &--change-the-future,
      &--change-the-future-x5 {
        background: url(../../assets/img/icons/big/change-the-future.png) no-repeat center/cover;
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
      font-size: 26px;
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
      font-size: 18px;
      background: #fff;
      margin-top: 20px;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 614px;

      &-text {
        margin-bottom: 10px;
      }
    }
  }
</style>
