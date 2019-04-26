import axios from 'axios';

const state = {
  selectedCards: [],
  trash: [],
  isPlayer: false,
  focused: true,
  settings: {},
};

const mutations = {
  updateSettings(state, settings) {
    state.settings = settings;
  },

  toggleCard(state, toggledCard) {
    const cardIndex = state.selectedCards.findIndex(card => card.id === toggledCard.id);

    if (cardIndex !== -1) {
      return state.selectedCards.splice(cardIndex, 1);
    }

    return state.selectedCards.push(toggledCard);
  },

  playerMove(state) {
    state.selectedCards = [];
  },

  updateTrash(state, trash) {
    state.trash = trash;
  },

  updatePlayerStatus(state, isPlayer) {
    state.isPlayer = isPlayer;
  },

  gameFocus(state) {
    state.focused = true;
  },

  gameBlur(state) {
    state.focused = false;
  },
};

const actions = {
  getSettings({ commit }) {
    return axios.post('/settings')
      .then(({ data }) => {
        commit('updateSettings', data);

        return data;
      })
      .catch(console.error)
  },
};

const getters = {
  settings(state) {
    return state.settings;
  },

  selectedCards(state) {
    return state.selectedCards;
  },

  isPlayer(state) {
    return state.isPlayer;
  },

  focused(state) {
    return state.focused;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
