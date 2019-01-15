export default class History {
  constructor() {
    this.moves = [];
  }

  get current() {
    return this.moves[this.moves.length - 1];
  }

  newMove(move) {
    this.moves.push(move);
  }
}
