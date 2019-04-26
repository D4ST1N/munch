<template>
  <div :class="{ 'Game': true, 'Game--slided': showCardDescription }">
    <GameRoomPlayers />
    <Trash />
    <GameDeck />
    <PlayerMove />
    <MoveCardsList />
    <PlayerDeck />
    <GameLog />
    <CardsList />
    <Console />
    <CardDescription />
    <Timer />
    <TargetedModal />
    <EndGamePopup />
  </div>
</template>

<script>
  import room from '../../../assets/mixins/room';
  import PlayerDeck from './PlayerDeck';
  import GameDeck from './GameDeck';
  import GameRoomPlayers from './GameRoomPlayers';
  import GameLog from './GameLog';
  import PlayerMove from './PlayerMove';
  import Trash from './Trash';
  import MoveCardsList from './MoveCardsList';
  import CardsList from './CardsList';
  import CardDescription from './CardDescription';
  import Console from './Console';
  import Timer from './Timer';
  import TargetedModal from './TargetedModal';
  import EndGamePopup from './EndGamePopup';

  export default {
    name: 'Game',
    components: {
      PlayerDeck,
      GameDeck,
      GameRoomPlayers,
      GameLog,
      PlayerMove,
      Trash,
      MoveCardsList,
      CardsList,
      CardDescription,
      Console,
      Timer,
      TargetedModal,
      EndGamePopup,
    },
    mixins: [
      room,
    ],

    data() {
      return {
        showCardDescription: false,
      };
    },

    created() {
      document.body.addEventListener('keyup', this.onKeyUp);
    },

    mounted() {
      this.$root.$emit('showMessage', {
        key: 'GAME.LOGS.GAME_STARTED',
      });
      this.$root.$on('showCardDescription', () => {
        this.showCardDescription = true;
      });
      this.$root.$on('hideCardDescription', () => {
        this.showCardDescription = false;
      });
    },

    beforeDestroy() {
      document.body.removeEventListener('keyup', this.onKeyUp);
    },

    methods: {
      onKeyUp(event) {
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          const now = performance.now();

          if (this.lastShiftTime && now - this.lastShiftTime < 200) {
            this.$root.$emit('showConsole');
          } else {
            this.lastShiftTime = now;
          }
        }

        if (event.code === 'Escape') {
          this.$root.$emit('hideConsole');
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .Game {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all .5s ease;

    &--slided {
      width: calc(100% - 400px);
    }
  }
</style>
