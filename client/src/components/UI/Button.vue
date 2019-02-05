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
    padding: 12px 16px;
    border: 0;
    line-height: 1;
    border-radius: 3px;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    margin-right: 8px;
    background: rgba(55,71,79 ,1);
    box-shadow: 0 1px 4px 0 rgba(55,71,79 ,.75);
    transition: all .375s;

    &:hover,
    &:focus {
      outline: none;
      background: rgba(69,90,100 ,1);
    }

    &:last-child {
      margin-right: 0;
    }

    &--red {
      background: rgba(230,74,25 ,1);

      &:hover,
      &:focus {
        background: rgba(244,81,30 ,1);
      }
    }

    &--green {
      background: rgba(67,160,71 ,1);

      &:hover,
      &:focus {
        background: rgba(76,175,80 ,1);
      }
    }

    &--blue {
      background: rgba(25,118,210 ,1);

      &:hover,
      &:focus {
        background: rgba(30,136,229 ,1);
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
      font-size: 14px;
    }

    &--big {
      font-size: 16px;
    }

    &--huge {
      font-size: 20px;
    }

    &--small {
      font-size: 12px;
    }

    &--tiny {
      font-size: 10px;
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
