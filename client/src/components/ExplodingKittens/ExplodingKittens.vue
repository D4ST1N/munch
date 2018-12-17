<template>
  <div class="exploding-kittens"></div>
</template>

<script>
const socket = window.io();

export default {
  name: 'ExplodingKittens',

  created() {
    socket.on('deck', console.log);
  },
};
</script>

<style scoped>

</style>
