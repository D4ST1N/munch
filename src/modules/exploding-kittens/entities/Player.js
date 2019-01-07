import Deck from './Deck';

export default class Player {
  constructor({ name, id }) {
    this.id = id;
    this.name = name;
    this.ready = false;
    this.active = true;
    this.exploded = false;
    this.deck = new Deck();
  }

  disconnect() {
    this.active = false;
  }

  reconnect(id) {
    this.id = id;
    this.active = true;
  }
}
