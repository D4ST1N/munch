<template>
  <div class="GameLogMessage">
    <component
      v-for="part in parseMessage(text, options)"
      :is="part.name"
      v-bind="part.options"
      :class="componentClass(part.name)"
      @iconClick="iconClick(part.options)"
    >{{ part.label }}</component>
  </div>
</template>

<script>
  import CardIcon from './CardIcon';

  export default {
    name: 'GameLogMessage',
    components: {
      CardIcon,
    },
    props: {
      text: {
        type: String,
      },
      options: {
        type: Object,
      },
    },

    methods: {
      parseMessage(text, options) {
        const messageParts = text.split(/(\${.+?})/);

        return messageParts.map((part) => {
          const isComponent = part.match(/\${.+?}/);

          if (isComponent) {
            const [componentName] = part.match(/[^${}]+/);

            return {
              name: componentName,
              options: options.component,
              label: part,
            };
          }

          return {
            name: 'span',
            label: part,
          }
        })
      },

      componentClass(component) {
        return {
          [`GameLogMessage__${component}`]: true,
        };
      },

      iconClick(options) {
        this.$root.$emit('showCardDescription', options.name);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .GameLogMessage {
    margin-bottom: 5px;
    color: #fff;
    font-size: 18px;

    &__CardIcon {
      display: inline-flex;
      margin: 0 2px;
      cursor: pointer;
      transform: scale(1.20) translate(0, 20%);
    }
  }
</style>
