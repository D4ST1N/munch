<template>
  <div class="game-ui">
    <GameRoomPlayers />
    <Trash />
    <GameDeck />
    <PlayerMove />
    <MoveCardsList />
    <PlayerDeck />
    <GameLog />
    <Dialog />
    <CardsList />
    <EndGamePopup />
  </div>
</template>

<script>
  import PlayerDeck      from './PlayerDeck';
  import GameDeck        from './GameDeck';
  import GameRoomPlayers from './GameRoomPlayers';
  import Dialog          from './Dialog';
  import GameLog         from './GameLog';
  import PlayerMove      from './PlayerMove';
  import Trash           from './Trash';
  import MoveCardsList   from './MoveCardsList';
  import ShowGameDeck    from './ShowGameDeck';
  import CardsList       from './CardsList';
  import EndGamePopup    from './EndGamePopup';

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
      MoveCardsList,
      CardsList,
      EndGamePopup,
    },

    data() {
      return {
        showDeck: false,
        deck: []
      };
    },

    mounted() {
      this.$root.$emit('startTimer', 60000);
    },
  };
</script>

<style scoped>

</style>
