<template>
  <div class="player-auth">
    <div class="player-auth__content">
      <h1 class="player-auth__title">{{ $text('PLAYER_AUTH.TITLE') }}</h1>
      <p class="player-auth__text">{{ $text('PLAYER_AUTH.ADD_NAME') }}</p>
      <input v-model="name" type="text" class="player-auth__player-name">
      <button class="player-auth__submit" @click="save" :disabled="!name">
        {{ $text('PLAYER_AUTH.SUBMIT') }}
      </button>
    </div>
  </div>
</template>

<script>
  import cookie from '../../assets/utils/cookie';

  export default {
    name: 'PlayerAuth',

    data() {
      return {
        name: '',
      };
    },

    created() {
      const playerName = cookie.get('playerName');

      if (playerName) {
        this.name = playerName;
        this.save();
      }
    },

    methods: {
      save() {
        cookie.set('playerName', this.name);
        this.$emit('auth', this.name);
        this.$store.commit('authorization', this.name);
        this.$store.commit('connect');

        this.$router.go(-1);
      },
    },
  };
</script>

<style lang="scss">
  .player-auth {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;

    &__content {
      background: rgba(55,71,79 ,1);
      color: #fff;
      padding: 20px 40px;
      text-align: center;
    }

    &__player-name {
      width: 100%;
      background: transparent;
      border: 0;
      border-bottom: 2px solid rgba(255, 255, 255, .6);
      font-size: 24px;
      padding: 4px 16px;
      color: #fff;
      text-align: center;
    }

    &__submit {
      padding: 8px 24px;
      color: #fff;
      background: rgba(33,150,243 ,1);
      border: 0;
      font-size: 20px;
      margin: 16px;
      cursor: pointer;
    }
  }
</style>
