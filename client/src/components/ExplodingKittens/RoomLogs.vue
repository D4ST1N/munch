<template>
  <div class="room-logs">
    <h1 v-if="message" class="room-logs__message">{{ message }}</h1>
    <div v-else v-for="log in logs" class="room-logs__item">
      <div class="room-logs__text">{{ $text(log.text, log.options) }}</div>
      <CardStack v-if="log.deck" :cards="log.deck" :areaWidth="1840" class="room-logs__deck" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import CardStack from './CardStack';

  export default {
    name: 'RoomLogs',
    components: {
      CardStack,
    },

    data() {
      return {
        logs: [],
        message: '',
      };
    },

    created() {
      axios.get(`/exploding-kittens/logs/${this.$route.params.id}`)
           .then(({ data }) => {
             this.logs = data;
           })
           .catch(() => {
             this.message = this.$text('LOGS.GAME_NOT_ENDED');
           });
    }
  };
</script>

<style lang="scss">
  .room-logs {
    display: flex;
    flex-direction: column;
    padding: 20px;

    &__item {
      display: inline-flex;
      flex-direction: column;
      padding: 10px;
      margin-bottom: 10px;
      background: rgba(236,239,241 ,1);
      border-radius: 4px;
    }

    &__deck {
      margin-top: 10px;
      position: relative;
    }
  }
</style>
