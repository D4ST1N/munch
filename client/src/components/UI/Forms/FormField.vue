<template>
  <div class="form-field">
    <label
      :class="{
        'form-field__wrapper': true,
        'form-field__wrapper--focused': !!formField.value
      }"
    >
      <input
        :value="formField.value"
        :type="formField.type"
        class="form-field__input"
        @input="onInput"
        @blur="onBlur"
      />
      <span class="form-field__label">{{ formField.label }}</span>
    </label>
    <transition name="form-field-info">
      <span v-if="!!formField.helper" class="form-field__helper-text">{{ formField.helper }}</span>
    </transition>
    <transition name="form-field-info">
      <span v-if="!!formField.error" class="form-field__error">{{ formField.error }}</span>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'FormField',
    props: {
      field: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        formField: this.field,
      };
    },

    methods: {
      onInput({ target }) {
        this.formField.value = target.value;
        this.$emit('onInput', this.formField.value);

        if (this.formField.error) {
          this.validate();
        }
      },

      onBlur() {
        this.$emit('onInputEnd', this.formField.value);
        this.validate();
      },

      validate() {
        const emptyInput = this.formField.value.trim() === '';

        if (emptyInput && this.formField.required) {
          this.formField.error = this.$text('PLAYER_AUTH.FIELD_REQUIRED');
        } else {
          this.formField.error = '';
        }
      }
    }
  };
</script>

<style lang="scss">
  .form-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    width: 100%;
    transform: scale(1);

    &__wrapper {
      display: flex;
      position: relative;

      &--focused {
        .form-field__input {
          border: 1px solid rgba(25,118,210 ,1);
        }

        .form-field__label {
          top: -6px;
          left: 12px;
          font-size: 12px;

          &:before {
            width: 100%;
            left: -2px;
          }
        }
      }
    }

    &__label {
      position: absolute;
      font-size: 16px;
      top: 14px;
      left: 16px;
      pointer-events: none;
      display: inline-flex;
      padding: 0 4px;
      line-height: 1;
      transition: all .375s ease;
      z-index: 1;

      &:before {
        content: '';
        position: absolute;
        width: calc(100% - 8px);
        height: 100%;
        top: 0;
        left: 4px;
        background: #fff;
        transition: all .5s ease-in;
        z-index: -1;
      }
    }

    &__input {
      border: 1px solid rgba(69,90,100 ,1);
      padding: 12px 16px;
      line-height: 1;
      font-size: 16px;
      width: 100%;
      border-radius: 3px;

      &:focus {
        border: 1px solid rgba(25,118,210 ,1);

        &+ .form-field__label {
          top: -6px;
          left: 12px;
          font-size: 12px;

          &:before {
            width: 100%;
            left: -2px;
          }
        }
      }
    }

    &__helper-text {
      font-size: 10px;
      margin: 4px 16px;
      text-align: left;
    }

    &__error {
      font-size: 10px;
      margin: 4px 16px;
      text-align: left;
      color: rgba(244,67,54 ,1);
      position: relative;
    }
  }

  .form-field-info {
    &-enter-active,
    &-leave-active {
      transition: .5s;
    }

    &-enter,
    &-leave-to {
      opacity: 0;
      top: -100%;
      margin-bottom: -15px;
    }
  }
</style>
