<template>
  <div v-if="!!deck.length" class="cards-list">
    <div class="cards-list__content">
      <div class="cards-list__wrapper">
        <CardStack :cards="deck" :areaWidth="1840" @cardClick="cardClick" />
      </div>
    </div>
  </div>
</template>

<script>
  import CardStack from './CardStack';

  export default {
    name: 'CardsList',
    components: {
      CardStack,
    },

    data() {
      return {
        deck: [],
        event: '',
        resolve: null,
        reject: null,
      };
    },

    created() {
      this.$store.getters.socket.on('showCardList', this.updateDeck);
      this.$root.$on('chooseCardType', (resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.$store.getters.socket.emit('getAllCardsType');
      });
    },

    methods: {
      updateDeck({ deck, event }) {
        this.deck = deck;
        this.event = event;
      },

      cardClick(card) {
        if (this.event) {
          this.$store.getters.socket.emit(this.event, {
            name: this.$store.getters.player.username,
            roomId: this.$route.params.id,
            card,
          });

          this.deck = [];
          this.event = '';
        } else if (this.resolve) {
          this.resolve({ card });
          this.deck = [];
        }
      }
    }
  };
</script>

<style lang="scss">
  .cards-list {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(55,71,79 ,.8);

    &__content {
      background: rgba(144,164,174 ,1);
      padding: 20px;
      width: calc(100vw - 40px);
    }

    &__wrapper {
      position: relative;
    }
  }
</style>
