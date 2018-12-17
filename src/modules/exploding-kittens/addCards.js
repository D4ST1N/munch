import Card from './entities/Card';

export default function addCards(deck, config) {
  for (let cardsCount = 0; cardsCount < config.count; cardsCount++) {
    const { name, description } = config;

    deck.push(new Card({
      name,
      description,
      action: () => {
        console.log(name);
      },
    }));
  }

  return deck;
}
