<template>
  <button :class="buttonClass" @click="buttonClick" :disabled="disabled">
    <slot name="before"></slot>
    <span v-if="label" class="button__text">{{ label }}</span>
    <slot name="after"></slot>
  </button>
</template>

<script>
  export default {
    name: "Button",
    props: {
      type: {
        type: String,
      },
      text: {
        type: [String, Number],
      },
      size: {
        type: String,
        default: 'medium'
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      button: {
        type: Object,
      },
      squash: {
        type: Boolean,
        default: false,
      },
      rectangular: {
        type: Boolean,
        default: false,
      },
      stop: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      label() {
        if (this.text === undefined) {
          return false;
        }

        if (typeof this.text === 'number') {
          return String(this.text);
        }

        return this.text;
      },

      buttonClass() {
        return {
          button: true,
          [`button--${this.type}`]: !!this.type,
          [`button--${this.size}`]: true,
          ['button--squash']: this.squash,
          ['button--rectangle']: this.rectangular,
        };
      },
    },

    methods: {
      buttonClick(event) {
        if (this.stop) {
          event.stopPropagation();
        }

        this.$emit('buttonClick', this.button, event);
      }
    }
  }
</script>

<style lang="scss">
  .button {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border: 0;
    line-height: 1;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-right: 8px;
    background: linear-gradient(to bottom, rgba(55,71,79 ,1), rgba(38,50,56 ,1));
    transition: all .375s;

    &:hover,
    &:focus {
      outline: none;
      background: linear-gradient(to bottom, rgba(69,90,100 ,1), rgba(55,71,79 ,1));
    }

    &:last-child {
      margin-right: 0;
    }

    &--red {
      background: linear-gradient(to bottom, rgba(244,81,30 ,1), rgba(230,74,25 ,1));

      &:hover,
      &:focus {
        background: linear-gradient(to bottom, rgba(230,74,25 ,1), rgba(216,67,21 ,1));
      }
    }

    &--green {
      background: linear-gradient(to bottom, rgba(76,175,80 ,1), rgba(67,160,71 ,1));

      &:hover,
      &:focus {
        background: linear-gradient(to bottom, rgba(67,160,71 ,1), rgba(56,142,60 ,1));
      }
    }

    &--blue {
      background: linear-gradient(to bottom, rgba(79,195,247 ,1), rgba(41,182,246 ,1));

      &:hover,
      &:focus {
        background: linear-gradient(to bottom, rgba(41,182,246 ,1), rgba(3,169,244 ,1));
      }
    }

    &--white {
      background: #fff;
      box-shadow: 2px 2px 8px 0 rgba(100,100,100 ,.8);
      color: rgba(84,110,122 ,1);

      &:hover,
      &:focus {
        background: linear-gradient(to bottom, #fff, #eee);
      }
    }

    &--transparent {
      background: transparent;
      box-shadow: none;
      color: #fff;

      &:hover,
      &:focus {
        background: rgba(255, 255, 255, .2);
      }
    }

    &--medium {
      font-size: 20px;
    }

    &--big {
      font-size: 24px;
    }

    &--huge {
      font-size: 28px;
    }

    &--small {
      font-size: 16px;
    }

    &--tiny {
      font-size: 14px;
    }

    &--squash {
      padding: 4px;
      border-radius: 4px;
    }

    &--rectangle {
      border-radius: 4px;
    }

    &:disabled {
      opacity: .6;
      pointer-events: none;
    }

    &__text {

      &:not(:first-child) {
        margin-left: 8px;
      }

      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
</style>
