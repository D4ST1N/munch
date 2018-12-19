<template>
  <div class="event-log">
    <div v-for="event in events" class="event-log__event">
      {{ event.who }}
      <img src="../../assets/img/gun.png" class="gun">
      {{ event.whom }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventLog',

  data() {
    return {
      events: [],
    }
  },

  created() {
    this.$root.$on('event', (event) => {
      this.events.push(event);
      setTimeout(() => {
        const index = this.events.indexOf(event);

        if (index !== -1) {
          this.events.splice(index, 1);
        }
      }, 15000);
    });
  }
};
</script>

<style lang="scss">
  .event-log {
    position: fixed;
    top: 10px;
    left: 10px;
    color: #fff;
    display: flex;
    flex-direction: column;

    &__event {
      display: flex;
    }
  }
  .gun {
    margin: 0 10px;
  }
</style>
