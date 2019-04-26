import User from '../../entities/User';

const state = {
  isLoggedIn: false,
  player: null,
  socket: null,
  error: false
};

const mutations = {
  authorization(state, payload) {
    state.isLoggedIn = true;
    const { username, ...data } = payload;
    state.player = new User(username, data);
    state.error = false;
  },

  authError(state) {
    state.error = true;
  },

  connect(state) {
    console.log('connecting to socket');
    state.socket = window.io({
      path: '/ws/exploding-kittens',
      reconnection: false
    });
  },
};

const actions = {
  login({ commit, dispatch }, data) {
    return fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
  },
  register({ commit, dispatch }, data) {
    return fetch('/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
  },
  getProfile() {
    return fetch('/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  }
};

const getters = {
  player(state) {
    return state.player;
  },

  isLoggedIn(state) {
    return state.isLoggedIn;
  },

  socket(state) {
    return state.socket;
  }
};

export default {
  state,
  mutations,
  getters,
  actions
}
