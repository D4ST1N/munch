<template>
  <div class="show-game-deck">
    <CardStack
      :cards="deck"
      @cardClick="toggleCard"
    />
  </div>
</template>

<script>
  import CardStack from './CardStack';

  export default {
    name: 'ShowGameDeck',
    components: {
      CardStack,
    },
    props: {
      currentDeck: {
        type: Object
      }
    },

    data() {
      return {
        deck: this.currentDeck || [],
      };
    },
  };
</script>

<style lang="scss">
  .show-game-deck {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    background: black;
    justify-content: center;
  }
</style>
