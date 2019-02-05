<template>
  <div class="player-auth">
    <div class="player-auth__content">
      <h1 class="player-auth__title">{{ formTitle }}</h1>
      <FormField
        :label="$text('PLAYER_AUTH.ADD_NAME')"
        :required="true"
        @onInput="nameInput"
      />
      <FormField
        v-if="!formLogin"
        type="email"
        :label="$text('PLAYER_AUTH.ADD_EMAIL')"
        :required="true"
        @onInput="emailInput"
      />
      <FormField
        type="password"
        :label="$text('PLAYER_AUTH.ADD_PASSWORD')"
        :required="true"
        :helper="passwordHelper"
        @onInput="passwordInput"
      />
      <Button type="green" :text="actionButtonText" @buttonClick="save" :disabled="disabled" />
      <Button type="blue" :text="$text(formChangeText)" @buttonClick="changeForm" />
    </div>
  </div>
</template>

<script>
  import cookie    from '../../assets/utils/cookie';
  import FormField from '../UI/Forms/FormField';

  export default {
    name: 'PlayerAuth',
    components: {
      FormField,
    },

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

    computed: {
      formTitle() {
        return this.formLogin ? this.$text('PLAYER_AUTH.TITLE') : this.$text('PLAYER_AUTH.REGISTER_FORM');
      },

      passwordHelper() {
        return this.formLogin ? '' : this.$text('PLAYER_AUTH.PASSWORD_HELPER');
      },

      actionButtonText() {
        return this.formLogin ? this.$text('PLAYER_AUTH.SUBMIT') : this.$text('PLAYER_AUTH.REGISTER');
      },

      disabled() {
        return !this.name || !this.password || (this.formLogin ? false : !this.email);
      },
    },

    created() {
      const playerName = cookie.get('playerName');

      if (playerName) {
        this.name = playerName;
      }
    },

    methods: {
      nameInput(value) {
        this.name = value;
      },
      emailInput(value) {
        this.email = value;
      },
      passwordInput(value) {
        this.password = value;
      },
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
                    this.$router.push('/');
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
    background: rgba(55,71,79 ,.8);

    &__content {
      background: #fff;
      padding: 20px 40px;
      text-align: center;
      width: 500px;
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
