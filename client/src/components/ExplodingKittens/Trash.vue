<template>
  <div :class="{'trash-ui': true}">
    <CardFlip
      v-for="(card, index) in trash"
      :key="card.id"
      :card="card"
      :style="{
        transform: getOffset(card, index),
        transition: 'all .75s ease',
        'z-index': index + 1,
        position: 'absolute'
      }"
    />
  </div>
</template>

<script>
  import CardFlip from "./CardFlip";

  export default {
    name: 'Trash',
    components: {
      CardFlip,
    },

    data() {
      return {
        trash: [],
      };
    },

    created() {
      this.$store.getters.socket.on('gameUpdate', (data) => {
        this.trash = data.gameTrash.slice(-5);
        this.$store.commit('updateTrash', data.gameTrash);
      });
    },

    methods: {
      getOffset(card, index) {
        return `translate(${this.cardOffsetX(card, index)}px, ${this.cardOffsetY(card, index)}px)`;
      },

      cardOffsetX(card, index) {
        return -1 * index;
      },

      cardOffsetY(card, index) {
        return -2 * index;
      },
    },
  };

</script>

<style lang="scss">
  .trash-ui {
    position: fixed;
    transition: all 0.15s ease;
    left: 100px;
    top: calc(70% - 200px);
  }
</style>
