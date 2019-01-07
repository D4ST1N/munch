import uuid from 'uuid/v1';

export default class Card {
  constructor(props) {
    this.props = props;
    this.id = uuid();
  }
}
