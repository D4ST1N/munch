import uuid                from 'uuid/v1';
import Deck                from './Deck';
import Player              from './Player';
import Watcher             from './Watcher';
import History             from './History';
import addCards            from './../helpers/addCards';
import getPlayerStartCards from './../helpers/getPlayerStartCards';
import config              from '../../../configs/exploding-kittens';
import randomInt           from '../../../utils/randomInt';
import playerGetExplodingKitten from '../helpers/playerGetExplodingKitten';

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

        if (card.props.type === 'exploding-kitten') {
          playerGetExplodingKitten(bridge, this, player, card);
        }
      });
      player.on('looseCard', (card) => {
        console.log('player looseCard event', card);

        if (card.props.type === 'cat-box' && player.deck.isCardExist('exploding-kitten')) {
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

    console.log(this.settings);

    const selectedCards = [].concat(
      ...this.settings.packs.map(
        pack => pack.items.filter(item => item.selected)
                    .map(item => item.name)
      )
    );

    console.log(selectedCards);

    selectedCards.forEach((cardType) => {
      const cardConfig = config.cards.find(card => card.type === cardType);

      if (!cardConfig) return;

      let cardsCount;

      switch (cardConfig.type) {
        case 'defuse':
          cardsCount = playersCount + (Math.ceil(playersCount / 2));
          break;
        case 'imploding-kitten':
          cardsCount = playersCount > 2 ? 1 : 0;
          break;
        case 'exploding-kitten':
          cardsCount = playersCount > 2 && selectedCards.includes('imploding-kitten')
                       ? playersCount - 2
                       : playersCount - 1;
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
          cardsCount = playersCount > 3 ? 6 : 4;
          break;
        case 'see-the-future-x5':
        case 'change-the-future-x5':
        case 'swap-top-and-bottom':
        case 'freedom':
        case 'catomic-bomb':
        case 'swap':
        case 'garbage-collector':
          cardsCount = playersCount > 3 ? 4 : 2;
          break;
        case 'cat-box':
          cardsCount = 1;
          break;
        default:
          cardsCount = Math.ceil((playersCount + 1) / 2) * 2;
          break;
      }

      addCards(this.deck.cards, cardConfig, cardsCount);
    });

    console.log('before handing out');
    console.log(this.deck.cards.map(card => card.props.type));
  }

  giveCardsToPlayers() {
    this.players.forEach((player) => {
      player.deck = new Deck(getPlayerStartCards(this.deck.cards));
      player.deck.shuffle();
    });

    this.deck.shuffle();

    if (this.settings.fastGame.selected) {
      const newCount = Math.ceil(this.deck.cards.length / 2);

      while (this.deck.cards.length > newCount) {
        const cardIndex = randomInt(0, this.deck.cards.length - 1);
        const card = this.deck.cards[cardIndex];

        if (!card) {
          debugger;
        }

        if (['exploding-kitten', 'imploding-kitten'].includes(card.props.type)) {
          continue;
        }

        this.deck.cards.splice(cardIndex, 1);
      }

      this.deck.shuffle();
    }

    console.log('after handing out');
    console.log(this.deck.cards.map(card => card.props.type));
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
      this.previousPlayer();
      this.nextPlayer();
    }
  }
}
