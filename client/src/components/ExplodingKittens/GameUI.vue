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
    <CardDescription />
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
  import CardsList       from './CardsList';
  import EndGamePopup    from './EndGamePopup';
  import CardDescription from './CardDescription';

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
      CardDescription,
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
