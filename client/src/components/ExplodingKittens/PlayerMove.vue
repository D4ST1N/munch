<template>
  <div class="player-move" :style="{ bottom: `${settings.card.height + 100}px` }">
    <Button
      v-if="show"
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
          'skip',
          'nope',
          'attack',
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
    },

    methods: {
      isMoveAvailable() {
        console.log(this.$store.getters.selectedCards);
        const cards = this.$store.getters.selectedCards;
        const cardsCount = cards.length;

        switch (cardsCount) {
          case 1:
            const [ card ] = cards;

            return this.allowedSingleCards.includes(card.props.type);

          case 2: {
            const isOnlyCatCards = cards.every(card => card.props.isCatCard);
            const [leftCard, rightCard] = cards;
            const sameCards = leftCard.props.type === rightCard.props.type;

            return isOnlyCatCards && sameCards;
          }

          case 3: {
            const isOnlyCatCards = cards.every(card => card.props.isCatCard);
            const sameCards = new Set(cards.map(card => card.props.type)).size === 1;

            return isOnlyCatCards && sameCards;
          }

          case 5:
            return new Set(cards.map(card => card.props.type)).size === 5;

          default:
            return false;
        }
      },

      move() {
        this.initMove().then((options) => {
          console.log(options);
          this.sendMove(options);
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
              resolve();
              break;
          }
        })
      },

      sendMove(options = {}) {
        this.$store.getters.socket.emit('playerMove', {
          name: this.$store.getters.player.name,
          roomId: this.$route.params.id,
          cards: this.$store.getters.selectedCards,
          options,
        });
        this.$store.commit('playerMove');
        this.show = false;
      },

      onFavor() {
        this.favorActive = true;
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
  }
</style>
