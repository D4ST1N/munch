import Card from './entities/Card';

export default function addCards(deck, config) {

  for (let cardsCount = 0; cardsCount < config.count; cardsCount++) {
    const { count, ...props } = config;

    deck.push(new Card(props));
  }

  return deck;
}
