<template>
  <div
    class="player-deck"
    :style="{ height: `${settings.card.height}px` }"
  >
    <Card
      v-for="(card, index) in deck"
      :card="card"
      type="playerCard"
      :style="{
        position: 'absolute',
        left: '50%',
        margin: 0,
        transform: `translate(${getCardOffset(index)}px, 0)`
      }"
    ></Card>
  </div>
</template>

<script>
  import Card from './Card';
  import settings from './settings';

  export default {
    name: 'PlayerDeck',
    components: {
      Card,
    },

    data() {
      return {
        settings,
        deck: [],
      };
    },

    created() {
      this.$store.getters.socket.on('gameUpdate', this.updateStats);
    },

    methods: {
      updatePlayerDeck(deck) {
        this.deck = deck;
      },

      updateStats(gameData) {
        this.updatePlayerDeck(gameData.playerDeck);
      },

      getCardOffset(index) {
        const maxWidth = window.innerWidth - 40;
        const cardCount = this.deck.length;
        const cardsWidth = cardCount * this.settings.card.width;
        const distancesWidth = (cardCount - 1) * this.settings.card.distance;
        const totalWidth = cardsWidth + distancesWidth;

        if (totalWidth < maxWidth) {
          console.log(1);
          return -totalWidth / 2 + index * (settings.card.width + this.settings.card.distance);
        }

        const cardSpace = (maxWidth - this.settings.card.width) / (cardCount - 1);

        return -maxWidth / 2 + index * cardSpace;
      },
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
