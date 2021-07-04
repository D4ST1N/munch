import shuffle   from '../../../utils/shuffle';
import randomInt from '../../../utils/randomInt';

export default class Deck {
  constructor(cards = []) {
    this.cards = cards;
  }

  get inverted() {
    return this.cards.map((card) => ({ id: card.id, inverted: true }));
  }

  get count() {
    return this.cards.length;
  }

  invert(excludedNames = []) {
    return this.cards.map((card) => {
      return excludedNames.includes(card.props.name)
        ? card
        : { id: card.id, inverted: true }
    });
  }

  hasCardOfName(name) {
    return !!this.cards.find(card => card.props.name === name);
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }

  addCard(card, random = true) {
    if (!card) {
      return;
    }

    if (random) {
      this.cards.splice(randomInt(0, this.cards.length - 1), 0, card);
    } else {
      this.cards.push(card);
    }
  }

  getCardIndex(cardName) {
    return this.cards.findIndex((card) => card.props.name === cardName);
  }

  isCardExist(cardName) {
    return this.getCardIndex(cardName) !== -1;
  }

  getCardCount(cardName) {
    return this.cards.filter(card => card.props.name === cardName).length;
  }

  useCard(cardId) {
    const index = this.cards.findIndex(card => card.id === cardId);

    if (index === -1) {
      return false;
    }

    return this.cards.splice(index, 1);
  }

  useCardByName(cardName) {
    return this.useCard(this.cards[this.getCardIndex(cardName)].id);
  }

  useUpperCard() {
    return this.cards.pop();
  }

  useLowerCard() {
    return this.cards.shift();
  }

  useRandomCard() {
    return this.cards.splice(randomInt(0, this.cards.length - 1), 1);
  }

  clear() {
    this.cards = [];
  }
}
