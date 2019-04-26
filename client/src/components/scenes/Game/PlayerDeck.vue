<template>
  <div class="PlayerDeck">
    <CardStack
      :cards="deck"
      @cardClick="toggleCard"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CardStack from './CardStack';
  import sortPlayerDeck from '../../../assets/utils/sortPlayerDeck';
  import Socket from '../../../entities/Socket';

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
      Socket.on('gameUpdate', this.updateStats);
      this.$root.showLoading = true;
    },

    methods: {
      ...mapGetters([
        'player',
      ]),

      updatePlayerDeck(deck) {
        this.deck = sortPlayerDeck(deck);
      },

      updateStats(gameData) {
        this.updatePlayerDeck(gameData.playerDeck);
      },

      toggleCard(card) {
        this.player().toggleCard(card);
        this.$root.$emit('playerSelectCard');
      },
    },
  };
</script>

<style lang="scss">
  .PlayerDeck {
    position: fixed;
    bottom: 30px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
