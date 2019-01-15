const state = {
  selectedCards: []
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
