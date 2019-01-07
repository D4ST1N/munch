/**
 * get card from deck
 * @param deck {Object}
 * @param cardType {String}
 * @returns {Array}
 */

export default function getCard(deck, cardType) {
  for (let i = deck.length - 1; i > 0; i--) {
    if (deck[i].props.type === cardType) {
      return deck.splice(i, 1);
    }
  }

  return [];
}
