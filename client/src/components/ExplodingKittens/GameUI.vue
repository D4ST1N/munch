<template>
  <div v-if="show" class="game-ui">
    <PlayerDeck />
  </div>
</template>

<script>
import PlayerDeck from './PlayerDeck';

export default {
  name: 'GameUI',
  components: {
    PlayerDeck,
  },

  data() {
    return {
      show: false,
    };
  },

  created() {
    this.$root.$on('gameStart', () => {
      this.show = true;
    });
  },
};
</script>

<style scoped>

</style>
