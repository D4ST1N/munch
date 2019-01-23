const state = {
  selectedCards: [],
  trash: [],
};

const mutations = {
  toggleCard(state, card) {
    const cardIndex = state.selectedCards.indexOf(card);

    if (cardIndex !== -1) {
      return state.selectedCards.splice(cardIndex, 1);
    }

    return state.selectedCards.push(card);
  },

  playerMove(state) {
    state.selectedCards = [];
  },

  updateTrash(state, trash) {
    state.trash = trash;
  },
};

const getters = {
  selectedCards(state) {
    return state.selectedCards;
  },
};

export default {
  state,
  mutations,
  getters,
};
