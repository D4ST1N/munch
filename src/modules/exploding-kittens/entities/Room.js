import uuid                from 'uuid/v1';
import Deck                from './Deck';
import config              from '../../../configs/exploding-kittens';
import addCards            from './../addCards';
import getPlayerStartCards from './../getPlayerStartCards';
import Player              from './Player';

export default class Room {
  constructor() {
    this.id = uuid();
    this.players = [];
    this.deck = new Deck();
    this.trash = [];
    this.currentPlayerIndex = 0;
    this.status = 'wait';
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get invertedDeck() {
    return this.deck.inverted;
  }

  get gameStarted() {
    console.log('gameStarted by status', this.status === 'started');
    if (this.status === 'started') return true;

    console.log('gameStarted by players', this.players.find(player => player.ready === false), this.players.length, config.game.minPlayerCount);
    return !this.players.find(player => player.ready === false)
      && this.players.length >= config.game.minPlayerCount;
  }

  get gameEnded() {
    return this.players.filter(player => !player.exploded).length === 1;
  }

  playerConnect(playerName, id) {
    let reconnect = false;

    if (this.isPlayerExist(playerName)) {
      reconnect = true;

      this.getPlayer(playerName).reconnect(id);
    } else {
      this.players.push(new Player({
        id,
        name: playerName,
      }));
    }

    return reconnect;
  }

  gameStart() {
    this.initGameDeck();
    this.giveCardsToPlayers();

    this.status = 'started';
  }

  initGameDeck() {
    config.cards.forEach((cardConfig) => {
      addCards(this.deck.cards, cardConfig);
    });

    this.deck.shuffle();
  }

  giveCardsToPlayers() {
    this.players.forEach((player) => {
      player.deck = new Deck(getPlayerStartCards(this.deck.cards));
    });
  }

  getPlayer(playerName) {
    return this.players.find(player => player.name === playerName);
  }

  isPlayerExist(playerName) {
    return !!this.getPlayer(playerName);
  }

  playersList() {
    return this.players.map((player) => ({
      name: player.name,
      exploded: player.exploded,
    }));
  }

  nextPlayer() {
    this.currentPlayerIndex++;

    if (this.currentPlayerIndex === this.players.length) {
      this.currentPlayerIndex = 0;
    }

    if (this.players[this.currentPlayerIndex].exploded) {
      return this.nextPlayer();
    }

    return this.currentPlayer
  }


}
