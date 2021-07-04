<template>
  <div class="PlayerMove" :style="{ bottom: `${ settings.game.cardSettings.height + 75 }px` }">
    <div v-if="show" class="PlayerMove__buttons">
      <Button
        v-if="showMoveButton"
        class="PlayerMove__btn"
        type="blue"
        size="huge"
        :text="$text('NOTIFICATIONS.GAME.MOVE')"
        :disabled="disabled"
        @buttonClick="move"
      />
      <Button
        v-if="showFavorButton"
        class="PlayerMove__btn"
        type="black"
        size="huge"
        :text="$text('NOTIFICATIONS.GAME.FAVOR')"
        :disabled="favorButtonDisabled"
        @buttonClick="sendFavorCard"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Socket from '../../../entities/Socket';

  export default {
    name: 'PlayerMove',

    data() {
      return {
        show: false,
        disabled: false,
        favorActive: false,
      };
    },

    computed: {
      ...mapGetters([
        'player',
        'settings',
      ]),

      showMoveButton() {
        return !this.favorActive && this.player.selectedCards.length > 0
          || this.favorActive && this.nopeCardSelected;
      },

      showFavorButton() {
        return this.favorActive && this.player.selectedCards.length > 0;
      },

      favorButtonDisabled() {
        return this.player.selectedCards.length !== 1;
      },

      nopeCardSelected() {
        const [card] = this.player.selectedCards;
        return this.player.selectedCards.length === 1 && card.props.name === 'nope';
      },
    },

    created() {
      this.$root.$on('playerSelectCard', () => {
        this.show = !!this.player.selectedCards.length;
        this.disabled = !this.isMoveAvailable();
      });
      Socket.on('gameUpdate', (data) => {
        this.favorActive = data.selected;
      });
    },

    methods: {
      isMoveAvailable() {
        const cards = this.player.selectedCards;
        const cardsCount = cards.length;

        switch (cardsCount) {
          case 1:
            const [card] = cards;
            console.log(card);

            return this.favorActive ? true : card.props.canBeUsed;

          case 2:
          case 3:
            const hasGmoCard = !!cards.find(card => card.props.name === 'gmo');
            const isOnlyFruitCards = cards.every(card => card.props.isFruitCard);
            const differentCards = new Set(cards.map(card => card.props.name)).size;

            return differentCards === 1 || differentCards === 2 && hasGmoCard && isOnlyFruitCards;

          case 5:
            return new Set(cards.map(card => card.props.name)).size === 5;

          default:
            return false;
        }
      },

      move() {
        this.initMove().then(this.sendMove).catch(console.error);
      },

      initMove() {
        return new Promise((resolve, reject) => {
          const { selectedCards } = this.player;

          switch (selectedCards.length) {
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

            case 5:
              resolve();

              break;

            default:
              const [card] = selectedCards;

              console.log(card.props);
              if (card.props.selectPlayer) {
                this.$root.$emit('choosePlayer', resolve, reject);
              } else {
                resolve();
              }

              break;
          }
        });
      },

      sendMove(options = {}) {
        Socket.emit('playerMove', {
          name: this.player.name,
          roomId: this.$route.params.id,
          cards: this.player.selectedCards,
          options,
        });

        this.player.clearSelectedCards();
        this.show = false;
      },

      sendFavorCard() {
        Socket.emit('playerSelectFavorCard', {
          name: this.player.name,
          roomId: this.$route.params.id,
          cards: this.player.selectedCards,
        });

        this.player.clearSelectedCards();
        this.show = false;
      },
    },
  };
</script>

<style lang="scss">
  .PlayerMove {
    position: fixed;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    pointer-events: none;

    &__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
    }

    &__btn {
      margin: 0 20px;
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
