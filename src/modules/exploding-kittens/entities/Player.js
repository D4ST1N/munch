import Entity from './Entity';
import Deck from './Deck';

export default class Player extends Entity {
  constructor({ name, id }) {
    super();

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
