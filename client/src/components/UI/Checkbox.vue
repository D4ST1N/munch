<template>
  <div class="checkbox">
    <div class="checkbox__content">
      <div
        :class="{
        'checkbox__surrogate': true,
        'checkbox__surrogate--checked': checkbox.selected,
        'checkbox__surrogate--partially-checked': isPartiallySelected,
        'checkbox__surrogate--disabled': checkbox.disabled,
      }"
        @click="toggle"
      ></div>
      <div class="checkbox__label" @click="toggle">{{ $text(checkbox.label) }}</div>
      <Icon
        v-if="checkbox.items"
        size="x-small"
        type="select_arrow_down"
        :clickable="true"
        @iconClick="toggleItems"
      ></Icon>
    </div>
    <div v-if="checkbox.items" v-show="showItems" class="checkbox__items">
      <Checkbox v-for="item in checkbox.items" :checkbox="item" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Checkbox',
    props: {
      checkbox: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        showItems: false,
      };
    },

    computed: {
      isPartiallySelected() {
        if (!this.checkbox.items) {
          return false;
        }

        return this.checkbox.items.some(item => item.selected)
          && this.checkbox.items.some(item => !item.selected);
      }
    },

    methods: {
      toggle() {
        this.checkbox.selected = !this.checkbox.selected;

        if (this.checkbox.items) {
          this.checkbox.items.forEach((item) => {
            item.selected = this.checkbox.selected;
          });
        }
      },

      toggleItems() {
        this.showItems = !this.showItems;
      },
    }
  };
</script>

<style lang="scss">
  .checkbox {
    margin-bottom: 8px;

    &__content {
      display: flex;
      align-items: center;
    }

    &__items {
      margin: 6px 12px;
    }

    &__surrogate {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      background: #fff url("../../assets/img/check.png") no-repeat center;
      position: relative;
      margin-right: 6px;
      cursor: pointer;
      transition: all .375s ease;

      &--checked {
        background: rgba(124,179,66 ,1) url("../../assets/img/check.png") no-repeat center;
      }

      &--partially-checked {
        background: #fff;

        &::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          top: 4px;
          left: 4px;
          background: rgba(124,179,66 ,1);
          border-radius: 2px;
        }
      }

      &--disabled,
      &--disabled + div {
        pointer-events: none;
        opacity: .66;
      }
    }

    &__label {
      cursor: pointer;
      margin-right: 8px;
    }
  }
</style>
