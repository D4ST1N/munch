<template>
  <div class="player-move" :style="{ bottom: `${settings.card.height + 100}px` }">
    <div v-if="favorActive" class="player-move__cat-paw"></div>
    <Button
      v-if="show"
      class="player-move__btn"
      type="blue"
      size="huge"
      :text="buttonText"
      :disabled="disabled"
      @buttonClick="move"
    />
  </div>
</template>

<script>
  import settings from './settings';

  export default {
    name: 'PlayerMove',

    data() {
      return {
        settings,
        show: false,
        disabled: false,
        favorActive: false,
        allowedSingleCards: [
          'shuffle',
          'see-the-future',
          'see-the-future-x5',
          'skip',
          'nope',
          'attack',
          'favor',
          'get-lower',
          'reverse',
          'attack-target',
          'change-the-future',
          'change-the-future-x5',
          'swap-top-and-bottom',
          'freedom',
          'catomic-bomb',
        ],
      };
    },

    computed: {
      buttonText() {
        return this.favorActive
          ? this.$text('NOTIFICATIONS.GAME.FAVOR')
          : this.$text('NOTIFICATIONS.GAME.MOVE');
      }
    },

    created() {
      this.$root.$on('playerSelectCard', () => {
        this.show = !!this.$store.getters.selectedCards.length;
        this.disabled = !this.isMoveAvailable();
      });
      this.$store.getters.socket.on('playerUseFavor', this.onFavor);
      this.$store.getters.socket.on('playerEndFavor', this.onFavorEnd);
    },

    methods: {
      isMoveAvailable() {
        const cards = this.$store.getters.selectedCards;
        const cardsCount = cards.length;

        switch (cardsCount) {
          case 1:
            const [ card ] = cards;

            return this.favorActive
                   ? true
                   : this.allowedSingleCards.includes(card.props.type);

          case 2:
          case 3:
            const hasWildCat = !!cards.find(card => card.props.type === 'wild-cat');
            const isOnlyCatCards = cards.every(card => card.props.isCatCard);
            const differentCards = new Set(cards.map(card => card.props.type)).size;

            return differentCards === 1 || differentCards === 2 && hasWildCat && isOnlyCatCards;

          case 5:
            return new Set(cards.map(card => card.props.type)).size === 5;

          default:
            return false;
        }
      },

      move() {
        this.initMove().then((options) => {
          if (this.favorActive) {
            this.sendFavorCard();
          } else {
            this.sendMove(options);
          }
          this.$root.$emit('playerMove');
        }).catch(console.error);
      },

      initMove() {
        return new Promise((resolve, reject) => {
          switch (this.$store.getters.selectedCards.length) {
            case 2:
              this.$root.$emit('choosePlayer', resolve, reject);

              break;
            case 3:
              this.$root.$emit('chooseCardType', ({ card }) => {
                this.$root.$emit('choosePlayer', ({ name }) => {
                  resolve({
                    card,
                    name,
                  });
                }, reject);
              }, reject);

              break;
            default:
              const cardType = this.$store.getters.selectedCards[0].props.type;

              if (['favor', 'attack-target'].includes(cardType)) {
                this.$root.$emit('choosePlayer', resolve, reject);
              } else {
                resolve();
              }

              break;
          }
        })
      },

      sendMove(options = {}) {
        this.$store.getters.socket.emit('playerMove', {
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id,
          cards: this.$store.getters.selectedCards,
          options,
        });
        this.$store.commit('playerMove');
        this.show = false;
      },

      sendFavorCard() {
        console.log('send card');
        this.$store.getters.socket.emit('playerSelectFavorCard', {
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id,
          cards: this.$store.getters.selectedCards,
        });
        this.$store.commit('playerMove');
        this.show = false;
        this.favorActive = false;
      },

      onFavor() {
        this.favorActive = true;
      },

      onFavorEnd() {
        this.favorActive = false;
      },
    },
  };
</script>

<style lang="scss">
  .player-move {
    position: fixed;
    width: 400px;
    left: calc(50% - 200px);
    display: flex;
    justify-content: center;

    &__btn {
      position: relative;
      z-index: 1;
    }

    &__cat-paw {
      width: 336px;
      height: 752px;
      position: fixed;
      background: url("../../assets/img/paw.png") no-repeat center;
      top: 0;
      left: calc(50% - 168px);
      animation: paw-in 1.5s ease;
      transform-origin: 50% 0;
      scale: 1.1;
    }
  }

  @keyframes paw-in {
    0% {
      transform: translate(0, -100%) rotate(80deg);
    }

    100% {
      transform: translate(0, 0) rotate(0);
    }
  }
</style>
