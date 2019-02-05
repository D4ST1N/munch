<template>
  <div id="app">
    <div class="app-version">{{ version }}</div>
    <div v-if="player" class="app__wrapper">
      <router-view></router-view>
    </div>
    <PlayerAuth v-else />
    <NotificationCenter />
  </div>
</template>

<script>
  import auth from './assets/mixins/auth';
  import PlayerAuth from './components/ExplodingKittens/PlayerAuth';
  import NotificationCenter from './components/Notifications/NotificationCenter';
  import gameData from '../package';

  export default {
    name: 'app',
    mixins: [auth],
    components: {
      NotificationCenter,
      PlayerAuth,
    },

    data() {
      return {
        theme: 'base',
        styles: null,
        version: gameData.version,
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
    &-version {
      position: fixed;
      top: 0;
      left: 0;
      display: inline-flex;
      font-family: monospace;
      font-size: 12px;
      background: #fff;
      color: rgba(255,87,34 ,1);
      line-height: 1;
      padding: 2px 6px;
      border-radius: 0 0 5px 0;

    }
  }
</style>
