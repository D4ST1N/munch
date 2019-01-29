<template>
  <div class="player-deck">
    <CardStack
      :cards="deck"
      :selectedCards="$store.getters.selectedCards"
      @cardClick="toggleCard"
    />
  </div>
</template>

<script>
  import CardStack      from './CardStack';
  import sortPlayerDeck from './helpers/sortPlayerDeck';

  export default {
    name: 'PlayerDeck',
    components: {
      CardStack,
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
        this.deck = sortPlayerDeck(deck);
      },

      updateStats(gameData) {
        this.updatePlayerDeck(gameData.playerDeck);
      },

      toggleCard(card) {
        this.$store.commit('toggleCard', card);
        this.$root.$emit('playerSelectCard');
      }
    },
  };
</script>

<style lang="scss">
  .player-deck {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
