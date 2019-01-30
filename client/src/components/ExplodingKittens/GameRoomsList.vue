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
          <Button
            size="small"
            :type="room.reconnected ? 'green' : 'black'"
            :text="$text(room.reconnected ? 'GAME_ROOMS.RETURN' : 'GAME_ROOMS.JOIN')"
          />
        </router-link>
        <Button v-else size="small" :text="$text('GAME_ROOMS.CREATE')" :disabled="true" @buttonClick="createRoom" />
      </div>
      <div class="game-rooms-list__room">
        <Button size="small" :text="$text('GAME_ROOMS.CREATE')" @buttonClick="createRoom" />
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
      }
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
      flex-wrap: wrap;
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
