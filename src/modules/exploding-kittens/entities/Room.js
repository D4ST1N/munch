import uuid                from 'uuid/v1';
import Deck                from './Deck';
import Player              from './Player';
import Watcher             from './Watcher';
import History             from './History';
import addCards            from './../helpers/addCards';
import getPlayerStartCards from './../helpers/getPlayerStartCards';
import randomInt           from '../../../utils/randomInt';
import playerGetExplodingKitten from '../helpers/playerGetExplodingKitten';
import settings from '../../../settings';

export default class Room {
  constructor(creator, { settings = {} } = {}) {
    this.creator = creator;
    this.settings = settings;
    this.id = uuid();
    this.players = [];
    this.watchers = [];
    this.deck = new Deck();
    this.trash = new Deck();
    this.currentPlayerIndex = 0;
    this.status = 'wait';
    this.penaltyMoves = 0;
    this.penaltyBackup = 0;
    this.previousPlayerIndex = null;
    this.move = null;
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
      && this.players.length >= settings.game.minPlayerCount;
  }

  get gameEnded() {
    return this.players.length === 1;
  }

  get next() {
    let index = this.currentPlayerIndex;

    index += this.direction;

    if (index >= this.players.length) {
      index = 0;
    }

    if (index < 0) {
      index = this.players.length - 1;
    }

    return this.players[index];
  }

  static getAllCardsTypes() {
    const deck = new Deck();

    settings.cards.forEach((cardConfig) => {
      addCards(deck.cards, cardConfig, 1);
    });

    return deck;
  }

  invertDeck() {
    return this.deck.invert(this.implodingKittenFound ? ['imploding-kitten'] : []);
  }

  playerConnect(bridge, playerName, id) {
    const isPlayer = this.isPlayerExist(playerName);
    const isWatcher = this.isWatcherExist(playerName);
    let reconnect = false;

    if (isPlayer) {
      reconnect = true;

      this.getPlayer(playerName).reconnect(id);
    } else if (!this.gameStarted) {
      const player = new Player({
        id,
        name: playerName,
      });
      this.players.push(player);
      player.on('getCard', (card) => {
        console.log('player getCard event', card);

        if (card.props.name === 'exploding-kitten') {
          playerGetExplodingKitten(bridge, this, player, card);
        }
      });
      player.on('looseCard', (card) => {
        console.log('player looseCard event', card);

        if (card.props.name === 'cat-box' && player.deck.isCardExist('exploding-kitten')) {
          playerGetExplodingKitten(bridge, this, player, card);
        }
      });
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

    const selectedCards = [].concat(
      ...this.settings.packs.map(
        pack => pack.items.filter(item => item.selected).map(item => item.name),
      ),
    );

    selectedCards.forEach((cardName) => {
      const cardConfig = settings.cards.find(card => card.name === cardName);

      if (!cardConfig) return;

      const cardsCount = cardConfig.count(playersCount, selectedCards);

      addCards(this.deck.cards, cardConfig, cardsCount);
    });
  }

  giveCardsToPlayers() {
    this.players.forEach((player) => {
      player.deck = new Deck(getPlayerStartCards(this.deck.cards));
      player.deck.shuffle();
    });

    if (this.settings.options.fastGame.selected) {
      const newCount = Math.ceil(this.deck.cards.length / 2);

      while (this.deck.cards.length > newCount) {
        const cardIndex = randomInt(0, this.deck.cards.length - 1);
        const card = this.deck.cards[cardIndex];

        if (!card) {
          debugger;
        }

        if (['exploding-kitten', 'imploding-kitten'].includes(card.props.name)) {
          continue;
        }

        this.deck.cards.splice(cardIndex, 1);
      }
    }

    console.log(this.deck.cards.map(card => card.props.name));

    this.deck.shuffle();

    console.log(this.deck.cards.map(card => card.props.name));
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
    this.penaltyMoves = 0;

    this.players.splice(playerIndex, 1);

    if (playerIndex === this.currentPlayerIndex) {
      if (this.direction > 0) {
        this.previousPlayer();
      }

      this.nextPlayer();
    }
  }
}
