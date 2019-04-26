<template>
  <div class="Room">
    <div class="Room__header">
      {{ room.creator }}
    </div>
    <div class="Room__content">
      <div class="Room__players">
        {{ $text('GAME_ROOMS.NUMBER_OF_PLAYERS') }} {{ room.players.length }}
      </div>
      <div class="Room__options">
        <div v-for="option in room.settings.options" v-if="option.selected" class="Room__option">
          {{ $text(option.label) }}
        </div>
      </div>
      <router-link :to="`/room/${room.id}/lobby`" class="Room__action" type="button">
        <Button
          :type="room.reconnected ? 'green' : 'black'"
          :text="$text(room.reconnected ? 'GAME_ROOMS.RETURN' : 'GAME_ROOMS.JOIN')"
        />
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Room',
    props: {
      room: {
        type: Object,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Room {
    display: flex;
    flex-direction: column;
    margin: 8px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, .4);
    overflow: hidden;

    &__header {
      padding: 10px 20px;
      background: rgba(55,71,79 ,1);
      color: #fff;
    }

    &__content {
      padding: 10px 20px;
      color: rgba(55,71,79 ,1);
    }

    &__players {
      margin-bottom: 10px;
    }

    &__options {
      display: flex;
      margin-bottom: 10px;
    }

    &__option {
      margin-right: 10px;
      padding: 4px 6px;
      border-radius: 3px;
      background: rgba(25,118,210 ,1);
      color: #fff;
      font-size: 12px;
      line-height: 1;
    }

    &__action {
      text-decoration: none;
    }
  }
</style>
