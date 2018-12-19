/**
 * get card from deck
 * @param deck {Object}
 * @param cardName {String}
 * @returns {Array}
 */

export default function getCard(deck, cardName) {
  for (let i = deck.length - 1; i > 0; i--) {
    if (deck[i].name === cardName) {
      return deck.splice(i, 1);
    }
  }

  return [];
}
