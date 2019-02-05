<template>
  <div :class="iconsClass" @click="click"></div>
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      type: {
        type: String,
      },
      size: {
        type: String,
        default: 'medium'
      },
    },

    computed: {
      iconsClass() {
        return {
          icon: true,
          [`icon--${this.type}`]: !!this.type,
          [`icon--${this.size}`]: true,
        };
      },
    },

    methods: {
      click() {
        this.$emit('iconClick');
      }
    }
  }
</script>

<style lang="scss">
  @mixin icon($icon) {
    background: url('../../assets/icons/#{$icon}.svg') no-repeat center;
  }

  @mixin monoIcon($icon) {
    -webkit-mask: url('../../assets/icons/#{$icon}.svg') no-repeat center;
    background: #fff;
  }

  .icon {
    display: inline-flex;
    pointer-events: none;
    transition: width .375s, height .375s;

    &--medium {
      width: 32px;
      height: 32px;
    }

    &--small {
      width: 24px;
      height: 24px;
    }

    &--tiny {
      width: 16px;
      height: 16px;
    }

    &--x-small {
      width: 12px;
      height: 12px;
    }

    &--big {
      width: 48px;
      height: 48px;
    }

    &--large {
      width: 64px;
      height: 64px;
    }

    &--huge {
      width: 96px;
      height: 96px;
    }

    &--cancel {
      @include icon('cancel');
    }

    &--select {
      @include icon('select');
    }

    &--brush {
      @include icon('brush');
    }

    &--dropper {
      @include icon('dropper');
    }

    &--grid {
      @include icon('grid');
    }

    &--add {
      @include icon('add');
    }

    &--minus {
      @include icon('minus');
    }

    &--save {
      @include icon('save');
    }

    &--move {
      @include icon('move');
    }

    &--folder {
      @include icon('folder');
    }

    &--folder_empty {
      @include icon('folder_empty');
    }

    &--walk {
      @include icon('walk');
    }

    &--file {
      @include icon('file');
    }

    &--map {
      @include icon('map');
    }

    &--menu {
      @include icon('menu');
    }

    &--scroll {
      @include icon('scroll');
    }

    &--info {
      @include icon('info');
    }

    &--castle {
      @include icon('castle');
    }

    &--edit {
      @include icon('edit');
    }

    &--hand {
      @include icon('hand');
    }

    &--trash {
      @include icon('trash');
    }

    &--search {
      @include monoIcon('search');
    }

    &--close {
      @include monoIcon('close');
    }

    &--return {
      @include monoIcon('return');
    }

    &--log {
      @include monoIcon('log');
    }

    &--map_mono {
      @include monoIcon('map_mono');
    }

    &--arrow_down {
      @include monoIcon('arrow_down');
    }

    &--arrow_up {
      @include monoIcon('arrow_up');
    }

    &--select_arrow_down {
      @include monoIcon('select_arrow_down');
    }

    &--cancel_mono {
      @include monoIcon('cancel');
    }

    &--add_mono {
      @include monoIcon('add');
    }
  }
</style>
