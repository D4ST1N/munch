<template>
  <div class="game-ui">
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
    };
  },

  created() {
  },
};
</script>

<style scoped>

</style>
