/**
 * get some {count} cards from {deck} excluding {disabledCards} or only {specificCard}
 * @param deck {Array} cards
 * @param count {Number} how much cards needed
 * @param [disabledCards] {Array} list of disabled cards names
 * @param [specificCard] {String} give cards exactly with this name
 * @returns {Array}
 */
import getCard from './getCard';

export default function getCards(deck, count, disabledCards = [], specificCard) {
  const cards = [];
  let disabledCount = 0;

  if (specificCard) {
    return getCard(deck, specificCard);
  }

  for (let cardsCount = 0; cardsCount < count;) {
    const cardIndex = deck.length - disabledCount - 1;
    const lastCard = deck[cardIndex];

    if (disabledCards.includes(lastCard.props.name)) {
      disabledCount++;

      continue;
    }

    cards.push(deck.splice(cardIndex, 1)[0]);
    cardsCount++;
  }

  return cards;
}
