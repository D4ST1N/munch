import shuffle   from '../../../utils/shuffle';
import randomInt from '../../../utils/randomInt';

export default class Deck {
  constructor(cards = []) {
    this.cards = cards;
  }

  get inverted() {
    return this.cards.map((card) => ({ id: card.id, inverted: true }));
  }

  shuffle() {
    shuffle(this.cards);
  }

  addCard(card, random = true) {
    if (random) {
      this.cards.splice(randomInt(0, this.cards.length - 1), 0, card);
    } else {
      this.cards.push(card);
    }
  }

  getCardIndex(cardType) {
    return this.cards.findIndex((card) => card.props.type === cardType);
  }

  isCardExist(cardType) {
    return this.getCardIndex(cardType) !== -1;
  }

  useCard(cardId) {
    const index = this.cards.findIndex(card => card.id === cardId);

    if (index === -1) {
      return false;
    }

    return this.cards.splice(index, 1);
  }

  useCardByType(cardType) {
    return this.useCard(this.cards[this.getCardIndex(cardType)].id);
  }

  useUpperCard() {
    return this.cards.pop();
  }
}