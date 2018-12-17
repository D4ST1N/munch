/**
 * get some {count} cards from {deck} excluding {disabledCards} or only {specificCard}
 * @param deck {Array} cards
 * @param count {Number} how much cards needed
 * @param [disabledCards] {Array} list of disabled cards names
 * @param [specificCard] {String} give exactly this type of cards
 */

export default function getCards(deck, count, disabledCards = [], specificCard) {
  const cards = [];
  let disabledCount = 0;

  for (let cardsCount = 0; cardsCount < count;) {
    const cardIndex = deck.length - disabledCount - 1;
    const lastCard = deck[cardIndex];

    if (disabledCards.includes(lastCard.name)) {
      disabledCount--;
      continue;
    }

    cards.push(deck.pop());
    cardsCount++;
  }

  return cards;
}
