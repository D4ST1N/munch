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
    background: rgba(96,125,139 ,1);
    user-select: none;
  }

  * {
    box-sizing: border-box;
  }
</style>
