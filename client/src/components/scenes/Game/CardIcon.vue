<template>
  <div :class="iconClass" @click="iconClick">
  </div>
</template>

<script>
  export default {
    name: 'CardIcon',
    props: {
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        default: 'tiny',
      },
    },

    computed: {
      iconClass() {
        return {
          'CardIcon': true,
          [`CardIcon--${ this.name }`]: true,
          [`CardIcon--${ this.size }`]: true,
        };
      },
    },

    methods: {
      iconClick() {
        this.$emit('iconClick');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../../assets/styles/cardIcons/mixins/iconSizes';

  $cards-list: defuse, exploding-kitten, attack, shuffle, see-the-future, see-the-future-x5, favor, nope, skip, get-lower, gmo, reverse, attack-target, change-the-future, change-the-future-x5, imploding-kitten, swap-top-and-bottom, freedom, catomic-bomb, swap, garbage-collector, cat-box, avocado, banana, mango, pineapple, orange, apple, grapes, cherry, trash;

  .CardIcon {
    display: flex;

    &--big {
      width: 80px;
      height: 80px;
      background-image: url(../../../assets/img/sprites/80x.png);
    }

    &--medium {
      width: 60px;
      height: 60px;
      background-image: url(../../../assets/img/sprites/60x.png);
    }

    &--small {
      width: 40px;
      height: 40px;
      background-image: url(../../../assets/img/sprites/40x.png);
    }

    &--tiny {
      width: 20px;
      height: 20px;
      background-image: url(../../../assets/img/sprites/20x.png);
    }

    @each $card in $cards-list {
      $index: index($cards-list, $card) - 1;
      $x: $index % 6;
      $y: floor($index / 6);
      &--#{$card} {
        @include iconSizes($x, $y);
      }
    }
  }
</style>
