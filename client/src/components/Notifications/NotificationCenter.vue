<template>
  <div class="notification-center">
    <transition-group
      tag="div"
      name="notification"
      :duration="{ enter: 500, leave: 1300 }"
      @after-leave="afterNotificationLeave"
    >
      <Notification
        v-for="notification in notifications"
        :key="notification.options.id"
        :notification="notification"
        @notificationClick="removeNotification(notification.options.id)"
        @notificationEnd="removeNotification"
      />
    </transition-group>
  </div>
</template>

<script>
  import uuid from 'uuid/v1';
  import Notification from './Notification.vue';
  import NotificationClass from './notification';
  import notificationDefaultOption from './notification-default-options';

  export default {
    name: 'NotificationCenter',
    components: {
      Notification,
    },

    data() {
      return {
        notifications: [],
        notificationsStack: [],
      };
    },

    created() {
      this.$root.$on('showNotification', (notificationData) => {
        this.notificationsStack.push(
          new NotificationClass(Object.assign(
            { id: uuid() },
            notificationDefaultOption,
            notificationData
          )),
        );

        if (this.notifications.length === 0) {
          this.addNotification();
        }
      });
    },

    methods: {
      removeNotification(id) {
        const index = this.notifications.findIndex(notification => notification.id === id);

        if (index === -1) {
          return;
        }

        this.notifications.splice(index, 1);
      },

      addNotification() {
        this.notifications.push(this.notificationsStack.shift());
      },

      afterNotificationLeave() {
        console.log('afterLeave');
        if (this.notificationsStack.length) {
          this.addNotification();
        }
      },
    },
  };
</script>

<style lang="scss">
  .notification-center {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;
  }
</style>
