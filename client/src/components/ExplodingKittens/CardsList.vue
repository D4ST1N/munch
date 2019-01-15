<template>
  <div v-if="cards.length" class="cards-list">
    <CardStack :cards="cards" type="card-list" />
  </div>
</template>

<script>
  import CardStack from './CardStack';

  export default {
    name: 'CardsList',
    components: {
      CardStack,
    },

    data() {
      return {
        cards: [],
      };
    },

    created() {
      this.$store.getters.socket.on('updateMove', (cards) => {
        this.cards = cards;
        console.log(cards);
      });
      this.$store.getters.socket.on('playerSelectCard', (cards) => {
        this.cards = cards;
      });
    },
  };
</script>

<style lang="scss">
  .cards-list {
    position: fixed;
    top: calc(50% - 250px);
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
