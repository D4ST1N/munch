<template>
  <div class="game-options-popup" @click.self="close">
    <div class="game-options-popup__wrapper">
      <h1 class="game-options-popup__title">{{ $text('GAME_ROOMS.GAME_SETTINGS') }}</h1>
      <h3 class="game-options-popup__title">{{ $text('GAME_ROOMS.PACKS.LABEL') }}</h3>
      <div class="game-options-popup__content">
        <Checkbox v-for="pack in packs" :checkbox="pack" />
      </div>
      <h3 class="game-options-popup__title">{{ $text('GAME_ROOMS.ADDITIONAL_OPTIONS') }}</h3>
      <div class="game-options-popup__content">
        <Checkbox :checkbox="fastGame" />
        <!--<Checkbox :checkbox="playerLimit" />-->
      </div>
      <Button :text="$text('GAME_ROOMS.CREATE')" type="green" @buttonClick="submit" />
    </div>
  </div>
</template>

<script>
  import settings from './settings';
  import Checkbox from '../UI/Checkbox';

  export default {
    name: 'GameOptionsPopup',
    components: {
      Checkbox,
    },

    data() {
      return {
        packs: settings.packs,
        fastGame: {
          name: 'fast-game',
          label: 'GAME_ROOMS.QUICK_GAME',
          selected: false,
          disabled: false,
        },
        // playerLimit: {
        //   name: 'limit-players',
        //   label: 'GAME_ROOMS.LIMIT_PLAYERS',
        //   selected: false,
        //   disabled: false,
        // }
      };
    },

    methods: {
      submit() {
        this.$emit('createRoom', {
          settings: {
            packs: this.packs,
            fastGame: this.fastGame,
            playerLimit: this.playerLimit,
          },
        });
      },

      close() {
        this.$emit('close');
      },
    }
  };
</script>

<style lang="scss">
  .game-options-popup {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &__wrapper {
      background: rgba(55,71,79 ,.8);
      color: #fff;
      padding: 20px;
    }

    &__content {
      margin-bottom: 20px;
      overflow: auto;
      max-height: 400px;
    }
  }
</style>
