<template>
  <div class="player-settings">
    <div class="player-settings__content">
      <h1 v-if="firstLoad">Hello!</h1>
      <h2>Choose your name:</h2>
      <input class="player-settings__name" type="text" v-model="name">
      <h2>Choose your Color:</h2>
      <div class="player-settings__colors">
        <button
          v-for="colorData in colors"
          :key="colorData.name"
          :class="{ 'player-settings__color': true, 'player-settings__color--selected': colorData.color === selectedColor }"
          :style="{ 'background-color': colorData.color }"
          @click="changeColor(colorData.color)"
        ></button>
      </div>
      <h3 v-if="firstLoad">Use <code class="key">W</code>, <code class="key">A</code>, <code class="key">S</code> and <code class="key">D</code> to move and mouse to shoot</h3>
      <h3 v-if="firstLoad">To change color or name use <code class="key">ctrl</code> + <code class="key">shift</code> + <code class="key">S</code></h3>
      <button :disabled="isCloseDisabled" class="player-settings__done" type="button" @click="close">Done</button>
    </div>
  </div>
</template>

<script>
  import gameConfig from './config';
  import cookie from '../../assets/utils/cookie';

  export default {
    name: "PlayerSettings",

    data() {
      return {
        firstLoad: true,
        colors: gameConfig.availableColors,
        name: '',
        selectedColor: '',
      };
    },

    created() {
      const playerName = cookie.get('playerName');
      const playerColor = cookie.get('playerColor');

      if (playerName) {
        this.firstLoad = false;
        this.name = playerName;
        this.selectedColor = playerColor;
      }
    },

    computed: {
      isCloseDisabled() {
        return !(this.selectedColor && this.name);
      }
    },

    methods: {
      changeColor(color) {
        this.selectedColor = color;
      },

      close() {
        const oldName = cookie.get('playerName');
        cookie.set('playerColor', this.selectedColor);
        cookie.set('playerName', this.name);
        this.$emit('close', {
          oldName,
          name: this.name,
          color: this.selectedColor,
          isNew: this.firstLoad,
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .player-settings {
    position: fixed;
    display: flex;
    width: 50%;
    height: auto;
    max-height: calc(100% - 40px);
    top: 20px;
    left: 25%;
    z-index: 1;

    @media (max-width: 1200px) {
      width: calc(100% - 40px);
      left: 20px;
    }

    &__content  {
      width: 100%;
      background: #37474F;
      padding: 20px;
      color: #ffffff;
      box-shadow: 0 0 16px 0 rgba(55, 77, 79, .6);
      overflow: auto;
    }

    &__name {
      font-size: 18px;
      color: #fff;
      background: transparent;
      border: 0;
      border-bottom: 4px solid rgba(255, 255, 255, .6);
      padding: 4px 0;
      transition: all .375s;
      width: 100%;
      text-align: center;

      &:focus {
        border-bottom: 4px solid rgba(255, 255, 255, 1);
        outline: none;
      }
    }

    &__colors {
    }

    &__color {
      width: 50px;
      height: 50px;
      margin: 10px;
      border: 2px dashed #fff;
      border-radius: 50%;
      cursor: pointer;
      position: relative;

      &:focus {
        outline: none;
      }

      &--selected::after {
        content: '';
        width: 20px;
        height: 20px;
        background: rgba(33,150,243 ,1);
        border: 1px solid #fff;
        border-radius: 50%;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    &__done {
      padding: 8px;
      font-size: 24px;
      width: 100%;
      color: #fff;
      background: rgba(33,150,243 ,1);
      border: 0;
      cursor: pointer;

      &:disabled {
        opacity: .6;
      }
    }
  }

  .key {
    padding: 4px 12px;
    background: #eee;
    color: rgba(255,112,67 ,1);
    border: 1px solid #bbb;
    border-radius: 4px;
    font-size: 18px;
  }
</style>
