<template>
  <div :class="{ 'notification': true }" @click="notificationClick">
    <div v-if="notification.options.icon" class="notification__icon"></div>
    <div class="notification__content">
      <div class="notification__title">{{ notification.options.title }}</div>
      <div class="notification__text">{{ notification.options.text }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Notification',
    props: {
      notification: Object,
    },

    mounted() {
      setTimeout(() => {
        this.$emit('notificationEnd');
      }, this.notification.options.time);
    },

    methods: {
      notificationClick() {
        this.$emit('notificationClick', this.notification.options.id);
      },
    },
  };
</script>

<style lang="scss">
  @import "../../assets/styles/animations";

  .notification {
    pointer-events: all;
    padding: 20px 40px;
    font-size: 28px;
    background: rgba(239,108,0 ,1);
    color: #fff;
    border-radius: 12px 24px;
    box-shadow: inset 8px 8px 48px 0 #ad3d00,
                inset -8px -8px 48px 0 #ffa726,
                2px 2px 50px 0 rgba(38,50,56,.75),
                2px 2px 0 2px #823c02;
    animation: notification-in .5s ease-in forwards;
    margin: 16px;

    &-leave-to {
      animation: notification-out 1.4s ease-out forwards;
    }
  }
</style>
