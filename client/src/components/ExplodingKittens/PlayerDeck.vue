<template>
  <div class="player-deck">
    <div v-for="card in deck" class="player-deck__card">
      {{ $text(card.name) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerDeck',

  data() {
    return {
      deck: [],
    };
  },

  created() {
    this.$store.getters.socket.emit(
      'getPlayerDeck',
      {
        name: this.$store.getters.player.name,
        roomId: this.$route.params.id
      },
      this.updatePlayerDeck
    );
    this.$root.$on('updateDeck', this.updatePlayerDeck)
  },

  methods: {
    updatePlayerDeck(deck) {
      this.deck = deck;
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

    &__card {
      padding: 10px;
      background: #fff;
      width: 200px;
      height: 280px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 24px;
      margin: 8px;
      box-shadow: 2px 2px 12px 0 rgba(38,50,56 ,.8);
    }
  }
</style>
