<template>
  <div class="player-move" :style="{ bottom: `${settings.card.height + 100}px` }">
    <Button
      v-if="show"
      type="blue"
      size="huge"
      :text="$text('NOTIFICATIONS.GAME.MOVE')"
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
      };
    },

    created() {
      this.$root.$on('playerSelectCard', () => {
        this.show = !!this.$store.getters.selectedCards.length;
        this.disabled = this.isMoveAvailable()
      });
    },

    methods: {
      isMoveAvailable() {
        console.log(this.$store.getters.selectedCards);
        const cards = this.$store.getters.selectedCards;
        const cardsCount = cards.length;

        return !(cardsCount === 1 && ['shuffle', 'see-the-future'].includes(cards[0].props.type));
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
