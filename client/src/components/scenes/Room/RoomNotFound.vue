<template>
  <div class="RoomNotFound">
    <h1 class="RoomNotFound__title">{{ $text('GAME_ROOMS.NOT_EXIST') }}</h1>
    <div class="RoomNotFound__cat"></div>
    <router-link to="/" class="RoomNotFound__action">
      <Button size="big" type="white" :text="$text('GAME_ROOMS.GO_HOME')" />
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'RoomNotFound',
  };
</script>

<style lang="scss" scoped>
  .RoomNotFound {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 20px;
    color: #fff;

    &__title {
      text-align: center;
    }

    &__cat {
      flex-grow: 1;
      width: 100%;
      margin: 50px;
      background: url("../../../assets/img/cat-not-found.png") no-repeat center/contain;
    }

    &__action {
      text-decoration: none;
    }
  }
</style>
