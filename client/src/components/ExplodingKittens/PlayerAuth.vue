<template>
  <div class="player-auth">
    <div class="player-auth__content">
      <h1 class="player-auth__title">{{ formTitle }}</h1>
      <FormField
        v-for="(field, fieldName) in forms[currentForm]"
        :key="`${currentForm}/${fieldName}`"
        :field="field"
        @onInput="fieldInput(field, ...arguments)"
      />
      <div class="player-auth__actions">
        <Button type="green" :text="actionButtonText" @buttonClick="save" :disabled="disabled" />
        <Button type="blue" :text="$text(formChangeText)" @buttonClick="changeForm" />
      </div>
      <transition name="form-field-info">
        <div v-if="!!formError" class="form-field__error">{{ formError }}</div>
      </transition>
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
        forms: {
          login: {
            username: {
              value: '',
              required: true,
              type: 'text',
              label: this.$text('PLAYER_AUTH.ADD_NAME'),
              error: '',
            },
            password: {
              value: '',
              required: true,
              type: 'password',
              label: this.$text('PLAYER_AUTH.ADD_PASSWORD'),
              error: '',
            },
          },
          register: {
            username: {
              value: '',
              required: true,
              type: 'text',
              label: this.$text('PLAYER_AUTH.ADD_NAME'),
              error: '',
            },
            email: {
              value: '',
              required: true,
              type: 'email',
              label: this.$text('PLAYER_AUTH.ADD_EMAIL'),
              error: '',
            },
            password: {
              value: '',
              required: true,
              type: 'password',
              label: this.$text('PLAYER_AUTH.ADD_PASSWORD'),
              helper: this.$text('PLAYER_AUTH.PASSWORD_HELPER'),
              error: '',
            },
          }
        },
        currentForm: 'login',
        formError: '',
        formChangeText: 'PLAYER_AUTH.REGISTER_FORM',
        submitText: {
          register: 'PLAYER_AUTH.REGISTER',
          login: 'PLAYER_AUTH.SUBMIT',
        },
        changeTexts: [
          'PLAYER_AUTH.REGISTER_FORM',
          'PLAYER_AUTH.LOGIN_FORM',
        ],
      };
    },

    computed: {
      formTitle() {
        return this.currentForm === 'login'
               ? this.$text('PLAYER_AUTH.TITLE')
               : this.$text('PLAYER_AUTH.REGISTER_FORM');
      },

      actionButtonText() {
        return this.$text(this.submitText[this.currentForm]);
      },

      disabled() {
        return false;
      },
    },

    created() {
      const playerName = cookie.get('playerName');

      if (playerName) {
        this.name = playerName;
      }
    },

    methods: {
      fieldInput(field, value) {
        this.$set(field, 'value', value);
      },
      save() {
        const method = this.currentForm;
        let userData = {};

        Object.entries(this.forms[this.currentForm]).forEach(([key, field]) => {
          userData[key] = field.value;
        });

        cookie.set('playerName', this.name);
        this.$store.dispatch(method, userData)
          .then((data) => {
            if (data.status >= 400) {
              this.$store.commit('authError');

              data.json().then((response) => {
                if (response.fields) {
                  response.fields.forEach((field) => {
                    this.forms[this.currentForm][field.name].error = this.$text(field.message);
                  });
                }

                if (response.error) {
                  this.formError = this.$text(response.error);
                }
              });

              return;
            }

            this.$store.dispatch('getProfile')
              .then((data) => {
                if (data.status >= 400) {
                  this.$store.commit('authError');
                  return;
                }
                data.json()
                  .then((body) => {
                    this.$store.commit('authorization', body.data);
                    this.$store.commit('connect');
                    this.$emit('auth', body.data.username);
                    this.$router.push('/');
                  });
              })
          });
      },
      changeForm() {
        this.currentForm = this.currentForm === 'login' ? 'register' : 'login';
        this.formChangeText = this.changeTexts.filter(item => item !== this.formChangeText)[0];
        this.formError = '';
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
      display: flex;
      flex-direction: column;
      align-items: center;
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
