<template>
  <div class="game-rooms-list">
    <h1>{{ $text('GAME_ROOMS.LIST') }}</h1>
    <div class="game-rooms-list__content">
      <div v-for="room in rooms" :key="room.id" class="game-rooms-list__room">
        <div class="game-rooms-list__room-name">
          {{ room.name }}
        </div>
        <div class="game-rooms-list__room-players">
          {{ $text('GAME_ROOMS.NUMBER_OF_PLAYERS') }} {{ room.players.length }}
        </div>
        <router-link :to="`/room/${room.id}`" class="game-rooms-list__room-join" type="button">
          <Button
            :type="room.reconnected ? 'green' : 'black'"
            :text="$text(room.reconnected ? 'GAME_ROOMS.RETURN' : 'GAME_ROOMS.JOIN')"
          />
        </router-link>
      </div>
      <div class="game-rooms-list__actions">
        <Button
          type="green"
          :text="$text('GAME_ROOMS.CREATE')"
          :offset="false"
          @buttonClick="createRoom"
        >
          <Icon slot="before" size="x-small" type="add_mono"></Icon>
        </Button>
        <Button type="green" :squash="true" @buttonClick="openOptionPopup">
          <Icon slot="before" size="medium" type="gears"></Icon>
        </Button>
      </div>
    </div>
    <GameOptionsPopup v-if="showOptionsPopup" @createRoom="createRoom" />
  </div>
</template>

<script>
  import GameOptionsPopup from './GameOptionsPopup';
  import settings from './settings';

  export default {
    name: 'GameRoomsList',
    components: {
      GameOptionsPopup,
    },

    data() {
      return {
        rooms: [],
        showOptionsPopup: false,
        defaultSettings: {
          packs: settings.packs,
          fastGame: {
            selected: false,
          },
        },
      };
    },

    created() {
      this.emitRoomsDataUpdate();
      this.$store.getters.socket.on('roomList', this.updateRoomList);
      this.$store.getters.socket.on('newGameStarted', this.emitRoomsDataUpdate);
    },

    computed: {
      playerName() {
        return this.$store.getters.player.username || ''
      }
    },

    methods: {
      updateRoomList(rooms) {
        this.rooms = rooms;
      },

      emitRoomsDataUpdate() {
        this.$store.getters.socket.emit('getRoomList', { name: this.playerName });
      },

      createRoom(options = { settings: this.defaultSettings }) {
        this.$store.getters.socket.emit('createRoom', { options, name: this.playerName });
        this.showOptionsPopup = false;
      },

      openOptionPopup() {
        this.showOptionsPopup = true;
      },
    }
  };
</script>

<style lang="scss">
  .game-rooms-list {
    padding: 20px;
    color: #fff;

    &__content {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    &__actions {
      margin: 8px;
      display: flex;
    }

    &__room {
      background: rgba(236,239,241 ,1);
      padding: 20px;
      border-radius: 5px;
      color: rgba(38,50,56 ,1);
      margin: 8px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      &-players {
        margin-bottom: 10px;
      }

      &-join,
      &-create,
      &-started {
        text-decoration: none;
      }

      &-started {
        opacity: 0.75;
        cursor: default;
      }
    }
  }
</style>
