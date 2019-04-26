<template>
  <div :class="playerClass" @click="onClick">
    <div
      :class="{
        'player-circle__name': true,
        'player-circle__name--current': playerName === name
      }"
    >{{ name }}</div>
  </div>
</template>

<script>
  export default {
    name: 'PlayerCircle',
    props: {
      name: String,
      current: Boolean,
    },

    data() {
      return {
        playerName: this.$store.getters.player.name
      }
    },

    computed: {
      playerClass() {
        return {
          'player-circle': true,
          'player-circle--current': this.current,
        };
      },
    },

    methods: {
      onClick() {
        this.$emit('playerClick');
      },
    },
  };
</script>

<style lang="scss">
  .player-circle {
    width: 100px;
    height: 100px;
    background: #1976D2;
    border-radius: 50%;
    border: 4px solid #fff;
    position: relative;
    margin: 16px;
    cursor: pointer;
    transition: all .375s;

    &--current {
      transform-origin: 50% 0;
      transform: scale(1.2);
      pointer-events: none;

      .game-room-players__container--active & {
        opacity: 0.25;
      }
    }

    &__name {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translate(-50%, 0);
      padding: 4px;
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, .4);
      background: var(--ui-player-circle-label-background-color);
      color: var(--ui-player-circle-label-color);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;

      &--current {
        background: var(--ui-player-circle-label-current-background-color);
      }
    }
  }
</style>
