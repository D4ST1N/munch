<template>
  <div class="card">
    {{ card.name }}
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
  }
};
</script>

<style scoped>

</style>
