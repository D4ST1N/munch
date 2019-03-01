const state = {
  selectedCards: [],
  trash: [],
  isPlayer: false,
  focused: true,
};

const mutations = {
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

const getters = {
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
  getters,
};
