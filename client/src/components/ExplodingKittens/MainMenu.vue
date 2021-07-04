<template>
  <div v-show="show" class="main-menu">
    <Button
      v-for="item in items"
      v-if="itemShowed(item)"
      class="main-menu__btn"
      :key="item.name"
      :text="$text(item.label)"
      :button="item"
      @buttonClick="itemClick"
    />
  </div>
</template>

<script>
  export default {
    name: 'MainMenu',

    data() {
      return {
        items: [
          {
            name: 'main',
            label: 'NOTIFICATIONS.GAME.TO_MAIN',
            icon: 'menu',
            show() {
              return this.$route.name !== 'exploding-kittens';
            },
            action() {
              this.$router.push('/');
              this.show = false;
            },
          },
          {
            name: 'leave',
            label: 'NOTIFICATIONS.GAME.LEAVE',
            icon: 'walk',
            show() {
              return this.$store.getters.isPlayer;
            },
            action() {
              this.$store.getters.socket.emit('playerLeave', {
                name: this.$store.getters.player.name,
                roomId: this.$route.params.id
              });
              this.show = false;
            },
          },
          {
            name: 'profile',
            label: 'NOTIFICATIONS.GAME.PROFILE',
            icon: 'walk',
            show() {
              return false;
            },
          },
          {
            name: 'logout',
            label: 'NOTIFICATIONS.GAME.LOGOUT',
            icon: 'walk',
            show() {
              return false;
            },
          },
          {
            name: 'close',
            label: 'NOTIFICATIONS.GAME.CLOSE',
            icon: 'close',
            action() {
              this.show = false;
            },
          },
        ],
        show: false,
      };
    },

    created() {
      this.$root.$on('showMainMenu', () => {
        this.show = true;
      });
      document.body.addEventListener('keyup', this.onKeyUp);
    },

    methods: {
      onKeyUp(event) {
        if (event.code === 'KeyO' && event.shiftKey) {
          this.show = true;
        }
      },

      itemClick(button) {
        if (button.action) {
          button.action.call(this);
        }
      },

      itemShowed(item) {
        if (item.show) {
          return item.show.call(this);
        }

        return true;
      }
    },
  };
</script>

<style lang="scss">
  .main-menu {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(38,50,56 ,.8);
    z-index: 1;

    &__btn {
      margin: 16px;
    }
  }
</style>
