import MovePart from './MovePart';

export default class Move {
  constructor() {
    this.parts = [];
  }

  get lastPart() {
    return this.parts[this.parts.length - 1];
  }

  get partsCards() {
    return this.parts.reduce((cards, part) => {
      cards.push(...part.deck.cards);

      return cards;
    }, []);
  }

  newPart(options) {
    this.parts.push(new MovePart(options));
  }
}
