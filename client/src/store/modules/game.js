const state = {
  selectedCards: [],
  trash: [],
  isPlayer: false,
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
};

const getters = {
  selectedCards(state) {
    return state.selectedCards;
  },

  isPlayer(state) {
    return state.isPlayer;
  },
};

export default {
  state,
  mutations,
  getters,
};
