<template>
  <div class="player-deck">
    <Card v-for="card in deck" :card="card"></Card>
  </div>
</template>

<script>
  import Card from './Card';

  export default {
    name: 'PlayerDeck',
    components: {
      Card,
    },

    data() {
      return {
        deck: [],
      };
    },

    created() {
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
    },

    methods: {
      updatePlayerDeck(deck) {
        console.log(deck);
        this.deck = deck;
      },

      updateStats(gameData) {
        this.updatePlayerDeck(gameData.playerDeck);
      },
    },
  };
</script>

<style lang="scss">
  .player-deck {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    overflow-x: auto;
  }
</style>
