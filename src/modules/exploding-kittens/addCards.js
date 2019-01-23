import Card from './entities/Card';

export default function addCards(deck, config, numberOfCards) {
  for (let cardsCount = 0; cardsCount < numberOfCards; cardsCount++) {
    deck.push(new Card(config));
  }

  return deck;
}
