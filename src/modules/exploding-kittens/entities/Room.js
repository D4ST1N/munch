import uuid                from 'uuid/v1';
import Deck                from './Deck';
import Player              from './Player';
import Watcher             from './Watcher';
import History             from './History';
import addCards            from './../helpers/addCards';
import getPlayerStartCards from './../helpers/getPlayerStartCards';
import config              from '../../../configs/exploding-kittens';

export default class Room {
  constructor() {
    this.id = uuid();
    this.players = [];
    this.watchers = [];
    this.deck = new Deck();
    this.trash = new Deck();
    this.currentPlayerIndex = 0;
    this.status = 'wait';
    this.penaltyMoves = 0;
    this.previousPlayerIndex = null;
    this.history = new History();
    this.logs = [];
    this.direction = 1;
    this.implodingKittenFound = false;
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
    return this.players.length === 1;
  }

  static getAllCardsTypes() {
    const deck = new Deck();

    config.cards.forEach((cardConfig) => {
      addCards(deck.cards, cardConfig, 1);
    });

    return deck;
  }

  invertDeck() {
    return this.deck.invert(this.implodingKittenFound ? [ 'imploding-kitten' ] : []);
  }

  playerConnect(playerName, id) {
    const isPlayer = this.isPlayerExist(playerName);
    const isWatcher = this.isWatcherExist(playerName);
    let reconnect = false;

    if (isPlayer) {
      reconnect = true;

      this.getPlayer(playerName).reconnect(id);
    } else if (!this.gameStarted) {
      this.players.push(new Player({
        id,
        name: playerName,
      }));
    } else if (!isWatcher) {
      this.watchers.push(new Watcher({
        id,
        name: playerName,
      }));
    } else {
      this.getWatcher(playerName).reconnect(id);
    }

    return reconnect;
  }

  gameStart() {
    this.initGameDeck();
    this.giveCardsToPlayers();

    this.status = 'started';
  }

  gameEnd() {
    this.status = 'ended';
  }

  initGameDeck() {
    const playersCount = this.players.length;

    config.cards.forEach((cardConfig) => {
      let cardsCount;

      switch (cardConfig.type) {
        case 'defuse':
          cardsCount = playersCount + (Math.ceil(playersCount / 2));
          break;
        case 'imploding-kitten':
          cardsCount = playersCount > 3 ? 1 : 0;
          break;
        case 'exploding-kitten':
          cardsCount = playersCount > 3 ? playersCount - 2 : playersCount - 1;
          break;
        case 'skip':
        case 'attack':
        case 'see-the-future':
        case 'nope':
        case 'favor':
        case 'shuffle':
        case 'get-lower':
        case 'wild-card':
        case 'change-the-future':
        case 'reverse':
        case 'attack-target':
          cardsCount = playersCount + (playersCount > 3 ? 0 : 1);
          break;
        default:
          cardsCount = Math.ceil((playersCount + 1) / 2) * 2;
          break;
      }

      addCards(this.deck.cards, cardConfig, cardsCount);
    });

    console.log(this.deck.cards.map(card => card.props.type));
  }

  giveCardsToPlayers() {
    this.players.forEach((player) => {
      player.deck = new Deck(getPlayerStartCards(this.deck.cards));
      player.deck.shuffle();
    });
    this.deck.shuffle();
  }

  getPlayer(playerName) {
    return this.players.find(player => player.name === playerName);
  }

  getWatcher(watcherName) {
    return this.watchers.find(watcher => watcher.name === watcherName);
  }

  isPlayerExist(playerName) {
    return !!this.getPlayer(playerName);
  }

  isWatcherExist(playerName) {
    return !!this.getWatcher(playerName);
  }

  playersList() {
    return this.players.map((player) => ({
      name: player.name,
      exploded: player.exploded,
    }));
  }

  nextPlayer(name, info) {
    let index = this.currentPlayerIndex;

    if (name) {
      index = this.players.findIndex(player => player.name === name);
    } else {
      index += this.direction;
    }

    if (index >= this.players.length) {
      index = 0;
    }

    if (index < 0) {
      index = this.players.length - 1;
    }

    if (info) {
      return this.players[index];
    }

    this.previousPlayerIndex = this.currentPlayerIndex;
    this.currentPlayerIndex = index;

    return this.currentPlayer
  }

  reverse() {
    this.direction *= -1;
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

  killPlayer(name) {
    let playerIndex;

    if (name) {
      playerIndex = this.players.findIndex(player => player.name === name);
    } else {
      playerIndex = this.currentPlayerIndex;
    }

    const player = this.players[playerIndex];

    if (!player) {
      return false;
    }

    this.trash.addCard(...player.deck.cards, false);
    player.deck.clear();

    this.players.splice(playerIndex, 1);
    this.previousPlayer();
    this.nextPlayer();
  }
}
