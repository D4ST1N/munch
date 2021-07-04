import Socket from './Socket';

export default class User {
  constructor(name, data) {
    this.name = name;
    this.data = data;
    this.selectedCards = [];
  }

  getRoomsList() {
    Socket.emit('getRoomList', { name: this.name });
  }

  createRoom(options) {
    Socket.emit('createRoom', { options, name: this.name });
  }

  joinRoom(roomId) {
    Socket.emit('playerJoin', {
      roomId,
      name: this.name,
    });
  }

  ready(roomId) {
    Socket.emit('playerReady', {
      roomId,
      name: this.name,
    });
  }

  toggleCard(toggledCard) {
    const cardIndex = this.selectedCards.findIndex(card => card.id === toggledCard.id);

    if (cardIndex !== -1) {
      return this.selectedCards.splice(cardIndex, 1);
    }

    return this.selectedCards.push(toggledCard);
  }

  clearSelectedCards() {
    this.selectedCards = [];
  }

  cardSelected(cardId) {
    return !!this.selectedCards.find(card => card.id === cardId);
  }
}
