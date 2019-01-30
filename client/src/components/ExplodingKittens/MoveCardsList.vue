<template>
  <div v-if="cards.length" class="move-cards-list">
    <CardStack :cards="cards" />
  </div>
</template>

<script>
  import CardStack from './CardStack';

  export default {
    name: 'MoveCardsList',
    components: {
      CardStack,
    },

    data() {
      return {
        cards: [],
      };
    },

    created() {
      this.$store.getters.socket.on('updateMove', ({ cards }) => {
        this.cards = cards;
      });
    },
  };
</script>

<style lang="scss">
  .move-cards-list {
    position: fixed;
    top: calc(50% - 120px);
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
