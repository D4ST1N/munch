<template>
  <div class="player-auth">
    <div class="player-auth__content">
      <h1 class="player-auth__title">{{ $text('PLAYER_AUTH.TITLE') }}</h1>
      <div>
        <p class="player-auth__text">{{ $text('PLAYER_AUTH.ADD_NAME') }}</p>
        <input v-model="name" type="text" class="player-auth__player-name">
      </div>
      <div v-if="!formLogin">
        <p class="player-auth__text">{{ $text('PLAYER_AUTH.ADD_EMAIL') }}</p>
        <input v-model="email" type="email" class="player-auth__player-name">
      </div>
      <div>
        <p class="player-auth__text">{{ $text('PLAYER_AUTH.ADD_PASSWORD') }}</p>
        <input v-model="password" type="password" class="player-auth__player-name">
      </div>
      <button class="player-auth__submit" @click="save" :disabled="!name && !password">
        {{ $text('PLAYER_AUTH.SUBMIT') }}
      </button>
      <button class="player-auth__submit" @click="changeForm">
        {{ $text(formChangeText) }}
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
        password: '',
        email: '',
        formChangeText: 'PLAYER_AUTH.REGISTER_FORM',
        changeTexts: [
          'PLAYER_AUTH.REGISTER_FORM',
          'PLAYER_AUTH.LOGIN_FORM',
        ],
        formLogin: true
      };
    },

    created() {
      const playerName = cookie.get('playerName');

      if (playerName) {
        this.name = playerName;
      }
    },

    methods: {
      save() {
        const method = this.formLogin ? 'login' : 'register';
        let userData = {
          username: this.name,
          password: this.password
        };

        if (!this.formLogin) {
          userData = {...userData, email: this.email}
        }
        cookie.set('playerName', this.name);
        this.$store.dispatch(method, userData)
          .then((data) => {
            if (data.status >= 400) {
              this.$store.commit('authError');
              return;
            }
            this.$store.dispatch('getProfile')
              .then(data => {
                if (data.status >= 400) {
                  this.$store.commit('authError');
                  return;
                }
                data.json()
                  .then(body => {
                    this.$store.commit('authorization', body.data);
                    this.$store.commit('connect');
                    this.$emit('auth', body.data.username);
                  });
              })
          });
      },
      changeForm() {
        this.formLogin = !this.formLogin;
        this.formChangeText = this.changeTexts.filter(item => item !== this.formChangeText)[0];
      }
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
