<template>
  <div class="game-ui">
    <GameRoomPlayers />
    <GameDeck />
    <PlayerDeck />
    <Dialog />
  </div>
</template>

<script>
  import PlayerDeck from './PlayerDeck';
  import GameDeck from './GameDeck';
  import GameRoomPlayers from './GameRoomPlayers';
  import Dialog from './Dialog';

  export default {
    name: 'GameUI',
    components: {
      PlayerDeck,
      GameDeck,
      GameRoomPlayers,
      Dialog,
    },

    data() {
      return {
      };
    },

    created() {
    },

    mounted() {
      this.$root.$emit('startTimer', 60000);
    }
  };
</script>

<style scoped>

</style>
