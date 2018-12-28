<template>
  <div class="game-deck">
    <Card
      v-for="(card, index) in deck"
      :card="card"
      :style="{ transform: `translate(${-1 * index}px, ${-2 * index}px)` }"
      @cardClick="getCard"
    ></Card>
  </div>
</template>

<script>
  import Card from './Card';

  export default {
    name: 'GameDeck',
    components: {
      Card,
    },

    data() {
      return {
        deck: [],
      };
    },

    created() {
      this.$store.getters.socket.emit('getDeck', {
        roomId: this.$route.params.id,
      }, this.updateDeck);
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
    },

    methods: {
      updateDeck(deck) {
        this.deck = deck;
      },

      updateStats(gameData) {
        this.updateDeck(gameData.gameDeck);
      },

      getCard() {
        console.log('click!');
        this.$store.getters.socket.emit('playerGetCard', {
          roomId: this.$route.params.id,
          name: this.$store.getters.player.name,
        });
        this.$root.$emit('moveEnd');
      },
    },
  };
</script>

<style lang="scss">
  .game-deck {
    position: fixed;
    left: 100px;
    top: calc(50% - 140px);

    > * {
      position: absolute;
    }
  }
</style>
