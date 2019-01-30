<template>
  <div id="app" :class="{
    'app__content': !allDataExists
  }">
    <router-view v-if="allDataExists"></router-view>
    <div v-else class="app__notification">
      <h2 class="app__message">{{ $text('NOTIFICATIONS.CONNECTING_DATA') }}</h2>
    </div>
    <NotificationCenter />
  </div>
</template>

<script>
  import auth from './assets/mixins/auth';
  import NotificationCenter from './components/Notifications/NotificationCenter';

  export default {
    name: 'app',
    mixins: [auth],
    components: {
      NotificationCenter,
    },

    data() {
      return {
        allDataExists: false,
        theme: 'base',
        styles: null,
      };
    },

    created() {
      this.styles = document.createElement('link');
      this.styles.rel = 'stylesheet';
      this.styles.href = `/themes/${this.theme}.css`;

      document.head.appendChild(this.styles);
    },

    methods: {
      changeTheme() {
        this.theme = this.theme === 'dark' ? 'base' : 'dark';
        this.styles.href = `/themes/${this.theme}.css`;
      }
    }
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Comfortaa:300,400,700&subset=cyrillic,cyrillic-ext');

  #app {
    font-family: 'Comfortaa', cursive;
    color: #2c3e50;
  }

  body {
    margin: 0;
    padding: 0;
    background: var(--ui-field-background-color);
    user-select: none;
  }

  * {
    box-sizing: border-box;
  }

  .app {

    &__content {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }

    &__notification {
      background: rgba(55,71,79 ,1);
      color: #fff;
      padding: 20px 40px;
      text-align: center;
    }

    &__message {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      margin-bottom: 4px;
      background: rgba(255, 255, 255, .1);
    }
  }
</style>
