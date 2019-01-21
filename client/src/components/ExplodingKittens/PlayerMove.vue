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

        if (cardsCount === 1) {
          const [ card ] = cards;

          return  this.allowedSingleCards.includes(card.props.type);
        }

        switch (cardsCount) {
          case 1:
            const [ card ] = cards;

            return this.allowedSingleCards.includes(card.props.type);

          case 2:
            const isOnlyCatCards = cards.every(card => card.isCatCard);
            const [ leftCard, rightCard ] = cards;
            const sameCards = leftCard.props.type === rightCard.props.type;

            return isOnlyCatCards && sameCards;

          case 3:

            return false;

          case 5:

            return false;

          default:
            return false;
        }
      },

      move() {
        this.$store.getters.socket.emit('playerMove', {
          name: this.$store.getters.player.name,
          roomId: this.$route.params.id,
          cards: this.$store.getters.selectedCards,
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
