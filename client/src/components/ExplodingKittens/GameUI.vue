<template>
  <div class="game-ui">
    <GameRoomPlayers />
    <CardList />
    <GameDeck />
    <PlayerDeck />
    <PlayerMove />
    <GameLog />
    <Dialog />
    <Trash />
  </div>
</template>

<script>
  import PlayerDeck from './PlayerDeck';
  import GameDeck from './GameDeck';
  import GameRoomPlayers from './GameRoomPlayers';
  import Dialog from './Dialog';
  import GameLog from './GameLog';
  import PlayerMove from './PlayerMove';
  import Trash from './Trash';
  import CardList from './CardsList';

  export default {
    name: 'GameUI',
    components: {
      PlayerDeck,
      GameDeck,
      GameRoomPlayers,
      Dialog,
      GameLog,
      PlayerMove,
      Trash,
      CardList,
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
