import Card from './entities/Card';

export default function addCards(deck, config, numberOfCards = config.count) {
  for (let cardsCount = 0; cardsCount < numberOfCards; cardsCount++) {
    const { count, ...props } = config;

    deck.push(new Card(props));
  }

  return deck;
}
