<template>
  <div class="Loader">
    <div class="Loader__content">
      <div class="Loader__img"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Loader',
  };
</script>

<style lang="scss" scoped>
  .Loader {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity .5s ease;
    background: var(--ui-field-background-color);

    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 185px;
      height: 185px;
      transform-origin: 25% 25%;
      animation: rotation 8s ease infinite;
    }

    &__img {
      width: 64px;
      height: 64px;
      background: url("../../assets/img/bomb.png") no-repeat center;
      animation: rotation 3.5s linear infinite;
    }
  }

  @keyframes rotation {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
</style>
