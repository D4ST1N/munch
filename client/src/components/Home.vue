<template>
  <div class="home">
    <router-link to="/circle-crush" class="home__link">
      <div class="circle-crush">
        <img src="../assets/img/bullet.png" alt="" class="circle-crush__icon">
        Circle crush!
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped lang="scss">
  .home {
    margin: 20px;

    &__link {
      display: inline-block;
      text-decoration: none;
    }
  }
  .circle-crush {
    background: rgba(33,150,243 ,1);
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 32px;

    &__icon {
      margin-right: 20px;
    }
  }
</style>
