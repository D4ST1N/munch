const state = {
  player: null,
  socket: null,
};

const mutations = {
  authorization(state, name) {
    state.player = {
      name,
    };
  },

  connect(state) {
    state.socket = window.io({ path: '/ws/exploding-kittens'});
  },
};

const getters = {
  player(state) {
    return state.player;
  },

  socket(state) {
    return state.socket;
  }
};

export default {
  state,
  mutations,
  getters,
}
