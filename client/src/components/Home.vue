<template>
  <div class="home">
    <router-link to="/circle-crush" class="home__link">
      <div class="menu-item">
        <img src="../assets/img/bullet.png" alt="" class="menu-item__icon">
        Circle crush!
      </div>
    </router-link>
    <router-link to="/" class="home__link">
      <div class="menu-item">
        <img src="../assets/img/kittens.png" alt="" class="menu-item__icon">
        Exploding kittens
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Home',

    created() {
      this.$router.push('/');
    }
  };
</script>

<style scoped lang="scss">
  .home {
    margin: 20px;
    display: flex;

    &__link {
      display: inline-block;
      text-decoration: none;
    }
  }
  .menu-item {
    background: rgba(33,150,243 ,1);
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 32px;
    margin-right: 16px;

    &__icon {
      margin-right: 20px;
      max-width: 48px;
      max-height: 36px;
    }
  }
</style>
