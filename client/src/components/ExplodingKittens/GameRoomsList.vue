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
        <router-link v-if="room.canJoin" :to="`/exploding-kittens/room/${room.id}`" class="game-rooms-list__room-join" type="button">
          {{ $text('GAME_ROOMS.JOIN') }}
        </router-link>
        <div v-else class="game-rooms-list__room-started">
          {{ $text('GAME_ROOMS.STARTED') }}
        </div>
      </div>
      <div class="game-rooms-list__room">
        <button class="game-rooms-list__room-create" @click="createRoom">
          {{ $text('GAME_ROOMS.CREATE') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameRoomsList',

    data() {
      return {
        rooms: [],
        playerName: this.$store.getters.player.name
      };
    },

    created() {
      this.emitRoomsDataUpdate();
      this.$store.getters.socket.on('roomList', this.updateRoomList);
      this.$store.getters.socket.on('newGameStarted', this.emitRoomsDataUpdate);
    },

    methods: {
      updateRoomList(rooms) {
        this.rooms = rooms;
      },

      emitRoomsDataUpdate() {
        this.$store.getters.socket.emit('getRoomList', { name: this.playerName });
      },

      createRoom() {
        this.$store.getters.socket.emit('createRoom', { name: this.playerName });
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
        padding: 8px 16px;
        text-decoration: none;
        background: rgba(38,50,56 ,1);
        color: #fff;
        border: 0;
        display: inline-block;
        cursor: pointer;
        font-size: 16px;
      }

      &-started {
        opacity: 0.75;
        cursor: default;
      }
    }
  }
</style>
