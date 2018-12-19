<template>
  <div v-if="show" class="die-popup">
    <h1>You killed by {{ whom }}</h1>
    <button class="die-popup__restart" @click="restart">Restart</button>
  </div>
</template>

<script>
export default {
  name: 'DiePopup',

  data() {
    return {
      name: '',
      show: false,
    }
  },

  created() {
    this.$root.$on('playerShooted', (whom) => {
      this.whom = whom;
      this.show = true;
    });
  },

  methods: {
    restart() {
      this.show = false;
      this.$emit('restart');
    }
  }
};
</script>

<style lang="scss">
  .die-popup {
    position: fixed;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    left: calc(50% - 200px);
    top: 20vh;
    background: rgba(38,50,56 ,1);
    color: #fff;
    padding: 20px 40px;
    box-sizing: border-box;
    box-shadow: 0 0 0 100vh rgba(38, 50, 56, .75);

    &__restart {
      padding: 20px 40px;
      background: #fff;
      color: #2c3e50;
      font-size: 20px;
      cursor: pointer;
    }
  }
</style>
