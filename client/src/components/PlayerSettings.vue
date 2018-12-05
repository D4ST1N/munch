<template>
  <div class="player-settings">
    <div class="player-settings__content">
      <button
        v-for="color in colors"
        :key="color.name"
        class="player-settings__color"
        :style="{ 'background-color': color.color }"
        @click="changeColor(color.color)"
      ></button>
    </div>
  </div>
</template>

<script>
  import gameConfig from '../config';
  import cookie from '../assets/utils/cookie';

  export default {
    name: "PlayerSettings",

    data() {
      return {
        colors: gameConfig.availableColors,
      };
    },

    methods: {
      changeColor(color) {
        cookie.set('playerColor', color);
        this.$emit('changeColor', color);
      }
    }
  };
</script>

<style scoped lang="scss">
  .player-settings {
    position: fixed;
    display: flex;
    width: 600px;
    height: auto;
    top: 100px;
    left: calc(50% - 300px);

    &__content  {
      background: #37474F;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
    }

    &__color {
      width: 50px;
      height: 50px;
      margin: 10px;
      border: 2px dashed #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
</style>
