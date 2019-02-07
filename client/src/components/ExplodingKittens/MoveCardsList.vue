<template>
  <div v-if="cards.length"
       class="move-cards-list"
       :style="{
         left: leftOffset,
         width: `${width}px`
       }"
  >
    <CardStack :cards="cards" :areaWidth="1140" />
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
        width: 1140,
      };
    },

    computed: {
      leftOffset() {
        return `${(window.innerWidth - this.width) / 2}px`
      }
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
    top: calc(50% - 160px);
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
