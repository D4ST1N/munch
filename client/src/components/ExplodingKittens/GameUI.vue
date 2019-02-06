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
    <ShowGameDeck
      v-if="showDeck"
      :current-deck="deck"
    />
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
      ShowGameDeck,
      CardsList,
      EndGamePopup,
    },

    data() {
      return {
        showDeck: false,
        deck: []
      };
    },

    created() {
      // TODO remove cheats events here
      this.$store.getters.socket.on('_showCurrentGameDeck', ({deck, timer}) => {
        this.deck = deck;
        this.showDeck = true;
        this.$root.$emit('showDialog', {
          time: timer
        });
      });

      this.$store.getters.socket.on('_hideCurrentGameDeck', () => {
        this.deck = [];
        this.showDeck = false;
        this.$root.$emit('hideDialog');
      });
    },

    mounted() {
      this.$root.$emit('startTimer', 60000);
    },
  };
</script>

<style scoped>

</style>
