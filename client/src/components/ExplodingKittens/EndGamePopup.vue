<template>
  <div v-if="show" class="end-game-popup">
    <div
      :class="{
        'end-game-popup__wrapper': true,
        'end-game-popup__wrapper--loose': !win
      }"
    >
      <div class="end-game-popup__icon">
        <img v-if="win" src="../../assets/img/award.png" alt="">
        <img v-else src="../../assets/img/explode.png" alt="">
      </div>
      <h1 class="end-game-popup__title">
        {{ $text(win ? 'NOTIFICATIONS.GAME.END_GAME.WIN' : 'NOTIFICATIONS.GAME.END_GAME.LOOSE')}}
      </h1>
      <router-link to="/exploding-kittens" class="end-game-popup__link">
        <Button type="white" size="big" :text="$text('NOTIFICATIONS.GAME.BACK_TO_ROOMS')" />
      </router-link>
      <Button
        v-if="!win"
        type="blue"
        size="big"
        :text="$text('NOTIFICATIONS.GAME.CONTINUE_WATCHING')"
        @buttonClick="close"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EndGamePopup',
    data() {
      return {
        show: false,
        win: true,
      };
    },

    created() {
      this.$store.getters.socket.on('endGame', ({ win }) => {
        this.win = win;
        this.show = true;
      });
    },

    methods: {
      close() {
        this.show = false;
      }
    }
  };
</script>

<style lang="scss">
  .end-game-popup {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(38,50,56 ,.8);
    z-index: 1;

    &__wrapper {
      background: rgba(76,175,80 ,1);
      color: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 10px;

      &--loose {
        background: rgba(255,87,34 ,1);
      }
    }

    &__link {
      text-decoration: none;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>
