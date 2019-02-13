<template>
  <div v-if="!!deck.length" class="cards-list">
    <div class="cards-list__content">
      <div class="cards-list__wrapper">
        <CardStack
          :cards="deck"
          :areaWidth="1840"
          :numbered="options.numbered"
          :static="options.numbered"
          :changeOrder="options.changeCardOrder"
          @cardClick="cardClick"
          @leftClick="leftClick"
          @rightClick="rightClick"
        />
      </div>
      <Button
        v-if="options.submitAvailable"
        class="cards-list__btn"
        type="green"
        size="medium"
        :text="$text('NOTIFICATIONS.GAME.SUBMIT')"
        @buttonClick="submit"
      />
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
        option: {},
      };
    },

    created() {
      this.$store.getters.socket.on('showCardList', this.updateDeck);
      this.$store.getters.socket.on('hideCardList', () => {
        this.deck = [];
      });
      this.$root.$on('chooseCardType', (resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.$store.getters.socket.emit('getAllCardsType');
      });
    },

    methods: {
      updateDeck({ deck, event, options = {} }) {
        this.deck = deck;
        this.event = event;

        console.log(options);
        this.options = options;
      },

      submit() {
        this.$store.getters.socket.emit(this.event, {
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id,
          cards: this.deck,
        });

        this.deck = [];
        this.event = '';
      },

      leftClick(card, index) {
        this.deck.splice(index, 0, ...this.deck.splice(index - 1, 1));
      },

      rightClick(card, index) {
        this.deck.splice(index, 0, ...this.deck.splice(index + 1, 1));
      },

      cardClick(card) {
        if (this.event && !this.changeCardOrder) {
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
    z-index: 1;

    &__content {
      background: rgba(144,164,174 ,1);
      padding: 20px;
      width: calc(100vw - 40px);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__btn {
      margin-top: 10px;
    }

    &__wrapper {
      position: relative;
    }
  }
</style>
