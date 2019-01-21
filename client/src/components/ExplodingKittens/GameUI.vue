<template>
  <div class="game-ui">
    <GameRoomPlayers />
    <CardList />
    <Trash />
    <GameDeck />
    <PlayerDeck />
    <PlayerMove />
    <GameLog />
    <Dialog />
    <ShowGameDeck
      v-if="showDeck"
      :current-deck="deck"
    />
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
  import ShowGameDeck from './ShowGameDeck';

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
      ShowGameDeck,
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
        this.deck = deck.cards;
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
