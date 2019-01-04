<template>
  <div class="game-ui">
    <GameRoomPlayers />
    <GameDeck />
    <PlayerDeck />
    <GameLog />
    <Dialog />
  </div>
</template>

<script>
  import PlayerDeck from './PlayerDeck';
  import GameDeck from './GameDeck';
  import GameRoomPlayers from './GameRoomPlayers';
  import Dialog from './Dialog';
  import GameLog from './GameLog';

  export default {
    name: 'GameUI',
    components: {
      PlayerDeck,
      GameDeck,
      GameRoomPlayers,
      Dialog,
      GameLog,
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
