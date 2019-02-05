import cookie from '../utils/cookie';

export default {
  computed: {
    player() {
      return this.$store.getters.player;
    }
  },

  created() {
    const playerCookie = cookie.get('playerName');

    if (playerCookie) {
      this.$store.dispatch('getProfile')
        .then((data) => {
          if (data.status >= 400) {
            this.$store.commit('authError');
            this.$router.push('/auth');
            return;
          }
          data.json()
            .then((body) => {
              this.$store.commit('authorization', body.data);
              this.$store.commit('connect');
              this.$emit('auth', body.data.username);
            });
        });
    } else {
      this.$router.push('/auth');
    }
  },
}
