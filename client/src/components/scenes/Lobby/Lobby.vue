<template>
  <div class="Lobby">
    <h1 class="Lobby__title">{{ $text('GAME_ROOMS.LIST') }}</h1>
    <div class="Lobby__content">
      <Room v-for="room in rooms" :room="room" />
      <div class="Lobby__action">
        <Button
          type="green"
          :text="$text('GAME_ROOMS.CREATE')"
          :offset="false"
          @buttonClick="createRoom"
        >
          <Icon slot="before" size="x-small" type="add_mono"></Icon>
        </Button>
        <Button type="green" :squash="true" @buttonClick="openOptionsPopup">
          <Icon slot="before" size="medium" type="gears"></Icon>
        </Button>
      </div>
    </div>

    <GameOptionsPopup
      :settings="gameSettings"
      v-if="showOptionsPopup"
      @createRoom="createRoom"
      @close="closeOptionsPopup"
    />
  </div>
</template>

<script>
  import Socket from '../../../entities/Socket';
  import { mapGetters } from 'vuex';
  import Room from './Room';
  import GameOptionsPopup from './GameOptionsPopup';
  import processPacksSettings from '../../../assets/utils/processPacksSettings';

  export default {
    name: 'Lobby',
    components: {
      Room,
      GameOptionsPopup,
    },

    data() {
      return {
        rooms: [],
        showOptionsPopup: false,
        gameSettings: {},
      };
    },

    created() {
      this.emitRoomsDataUpdate();
      Socket.on('roomList', this.updateRoomList);
      Socket.on('newGameStarted', this.emitRoomsDataUpdate);

      this.gameSettings = {
        packs: processPacksSettings(this.settings().packs, this.settings().cards),
        options: this.settings().options,
      };
    },

    methods: {
      ...mapGetters([
        'settings',
      ]),
      updateRoomList(rooms) {
        this.rooms = rooms;
      },

      emitRoomsDataUpdate() {
        this.$store.getters.player.getRoomsList();
      },

      createRoom(options = { settings: this.gameSettings }) {
        console.log(options);
        this.$store.getters.player.createRoom(options);
        this.showOptionsPopup = false;
      },

      openOptionsPopup() {
        this.showOptionsPopup = true;
      },

      closeOptionsPopup() {
        this.showOptionsPopup = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .Lobby {
    padding: 20px;
    color: #fff;

    &__content {
      display: flex;
      align-items: flex-start;
    }

    &__action {
      display: flex;
      margin: 8px;
    }
  }
</style>
