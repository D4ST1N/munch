const state = {
  selectedCards: [],
  trash: [],
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
