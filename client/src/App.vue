<template>
  <div id="app">
    <router-view></router-view>
    <NotificationCenter />
  </div>
</template>

<script>
  import NotificationCenter from './components/Notifications/NotificationCenter';

  export default {
    name: 'app',
    components: {
      NotificationCenter,
    },

    data() {
      return {
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
</style>
