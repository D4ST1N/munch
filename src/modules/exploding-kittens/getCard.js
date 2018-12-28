/**
 * get card from deck
 * @param deck {Object}
 * @param cardId {String}
 * @returns {Array}
 */

export default function getCard(deck, cardId) {
  for (let i = deck.length - 1; i > 0; i--) {
    if (deck[i].props.id === cardId) {
      return deck.splice(i, 1);
    }
  }

  return [];
}
