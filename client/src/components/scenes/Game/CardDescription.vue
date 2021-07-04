<template>
  <div :class="{ 'CardDescription': true, 'CardDescription--hidden': !show }">
    <CardIcon :name="cardName" size="big"></CardIcon>
    <h1>{{ $text(`CARDS.${formattedCardName}.NAME`) }}</h1>
    <p class="CardDescription__text">{{ $text(`CARDS.${formattedCardName}.DESCRIPTION`) }}</p>
    <Button :text="$text('NOTIFICATIONS.GAME.CLOSE')" @buttonClick="close" />
  </div>
</template>

<script>
  import CardIcon from './CardIcon';

  export default {
    name: 'CardDescription',
    components: {
      CardIcon,
    },

    data() {
      return {
        cardName: '',
        show: false,
      };
    },

    computed: {
      formattedCardName() {
        return this.cardName.replace(/-/g, '_').toUpperCase();
      },
    },

    created() {
      this.$root.$on('showCardDescription', (cardName) => {
        this.cardName = cardName;
        this.show = true;
      });
    },

    methods: {
      close() {
        this.show = false;
        this.$root.$emit('hideCardDescription');
      },
    }
  };
</script>

<style lang="scss">
  .CardDescription {
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 400px;
    height: 100%;
    padding: 20px;
    background: #E3F2FD;
    transition: all .5s ease;
    box-shadow: inset 5px 0 20px -4px rgba(0, 0, 0, 0.4);
    z-index: 1;

    &--hidden {
      transform: translate(100%, 0);
    }

    &__text {
      font-size: 18px;
    }
  }
</style>
