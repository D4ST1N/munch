import uuid                from 'uuid/v1';
import Deck                from './Deck';
import Player              from './Player';
import History             from './History';
import addCards            from './../addCards';
import getPlayerStartCards from './../getPlayerStartCards';
import config              from '../../../configs/exploding-kittens';

export default class Room {
  constructor() {
    this.id = uuid();
    this.players = [];
    this.deck = new Deck();
    this.trash = [];
    this.currentPlayerIndex = 0;
    this.status = 'wait';
    this.penaltyMoves = 0;
    this.previousPlayerIndex = null;
    this.history = new History();
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  get invertedDeck() {
    return this.deck.inverted;
  }

  get gameStarted() {
    if (this.status === 'started') return true;

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

  nextPlayer(info) {
    let index = this.currentPlayerIndex;

    index++;

    if (index === this.players.length) {
      index = 0;
    }

    if (this.players[index].exploded) {
      return this.nextPlayer(info);
    }

    if (info) {
      return this.players[index];
    }

    this.previousPlayerIndex = this.currentPlayerIndex;
    this.currentPlayerIndex = index;

    return this.currentPlayer
  }

  previousPlayer(info) {
    if (info) {
      return this.players[this.previousPlayerIndex];
    }

    this.currentPlayerIndex = this.previousPlayerIndex;

    return this.currentPlayer;
  }

  playerEndMove() {
    if (this.penaltyMoves > 0) {
      this.penaltyMoves--;
    }

    return this.penaltyMoves > 0;
  }
}
