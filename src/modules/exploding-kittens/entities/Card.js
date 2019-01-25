import uuid      from 'uuid/v1';
import { cards } from '../../../configs/exploding-kittens';

export default class Card {
  constructor(props) {
    this.props = props;
    this.id = uuid();
  }

  static newCard(type) {
    const cardConfig = cards.find(card => card.type === type);
    return new Card(cardConfig);
  }
}
