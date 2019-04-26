import uuid from 'uuid/v1';
import settings from '../../../settings';

export default class Card {
  constructor(props) {
    this.props = props;
    this.id = uuid();
  }

  static newCard(name) {
    const cardConfig = settings.cards.find(card => card.name === name);

    if (cardConfig) {
      return new Card(cardConfig);
    }

    return false;
  }
}
