import Card      from '../entities/Card';
import randomInt from '../../../utils/randomInt';

export default function addCards(deck, config, numberOfCards, random = true) {
  for (let cardsCount = 0; cardsCount < numberOfCards; cardsCount++) {
    const card = new Card(config);

    if (random) {
      deck.splice(randomInt(0, deck.length - 1), 0, card);
    } else {
      deck.push(card);
    }
  }

  return deck;
}
