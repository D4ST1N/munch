<template>
  <div
    class="player-deck"
    :style="{ height: `${settings.card.height}px` }"
  >
    <CardFlip
      v-for="(card, index) in deck"
      :card="card"
      :selected="isCardSelected(card.id)"
      type="playerCard"
      :style="{
        position: 'absolute',
        left: '50%',
        transform: `translate(${getCardOffset(index)}px, 0)`
      }"
      @cardClick="toggleCard"
    ></CardFlip>
  </div>
</template>

<script>
  import Card from './Card';
  import CardFlip from './CardFlip';
  import settings from './settings';

  export default {
    name: 'PlayerDeck',
    components: {
      Card,
      CardFlip,
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
          return -totalWidth / 2 + index * (settings.card.width + this.settings.card.distance);
        }

        const cardSpace = (maxWidth - this.settings.card.width) / (cardCount - 1);

        return -maxWidth / 2 + index * cardSpace;
      },

      isCardSelected(id) {
        return !!this.$store.getters.selectedCards.find(card => card.id === id);
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
