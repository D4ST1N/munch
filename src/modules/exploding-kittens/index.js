import ioStarter                from './socket';
import Rooms                    from './entities/Rooms';
import Room                     from './entities/Room';
import Card                     from './entities/Card';
import EventBridge              from './entities/EventBridge';
import getRoom                  from './helpers/getRoom';
import playerGetExplodingKitten from './helpers/playerGetExplodingKitten';
import sendGameMessage          from './helpers/sendGameMessage';
import getRoomsList             from './helpers/getRoomsList';
import gameUpdate               from './helpers/gameUpdate';
import playerConnect            from './helpers/playerConnect';
import newMove                  from './helpers/newMove';
import cardsApply               from './helpers/cardsApply';

export default function init() {
  const io = ioStarter('/ws/exploding-kittens');
  const bridge = new EventBridge(io);

  bridge.on('knockKnock', (socket, { roomId, event }) => {
    console.log('Knock knock');
    bridge.emit(socket.id, event, { exist: !!getRoom(Rooms, roomId) });
  });

  bridge.on('getGameUpdates', (socket, { room }) => {
    gameUpdate(bridge, room);
  });

  bridge.on('playerGetCard', (socket, { room, name }) => {
    const player = room.currentPlayer;

    if (player.name !== name) {
      return;
    }

    const oldMove = room.history.current;

    if (oldMove) {
      oldMove.endMove();
      oldMove.allCards.forEach(card => room.trash.addCard(card, false));
    }

    const card = room.deck.useUpperCard();

    console.log('player get', card.props.type, 'card');

    if (card.props.type === 'exploding-kitten') {
      playerGetExplodingKitten(bridge);
    } else {
      player.deck.addCard(card);
    }

    if (!room.playerEndMove()) {
      room.nextPlayer();
    }

    sendGameMessage(bridge,'NOTIFICATIONS.GAME.PLAYER_TURN', room);
    newMove(room, room.currentPlayer);
    bridge.emit(room.id, 'updateMove', { cards: room.history.current.allCards });
    gameUpdate(bridge, room);
  });

  bridge.on('getRoomList', (socket, { name }) => {
    const roomsArray = getRoomsList(Rooms, name);

    bridge.emit(socket.id, 'roomList', roomsArray);
  });

  bridge.on('createRoom', (socket, { name }) => {
    Rooms.push(new Room());

    console.log(name);
    const roomsArray = getRoomsList(Rooms, name);

    bridge.emitAll('roomList', roomsArray);
  });

  bridge.on('playerJoin', (socket, { name, room }) => {
    playerConnect(bridge, name, room, socket);
  });

  bridge.on('playerReady', (socket, { name, room }) => {
    console.log('Player ready:', name);

    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    player.ready = true;

    console.log('emit status', player.name);
    bridge.emit(room.id, 'gameStatus', room.players);

    if (!room.gameStarted) {
      return;
    }

    room.gameStart();

    console.log('game start');

    bridge.emitAll('newGameStarted');
    bridge.emit(room.id, 'gameStart');
    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
    gameUpdate(bridge, room);
  });

  bridge.on('stopAction', (socket, { room, name }) => {
    console.log('stop action');
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    const usedCard = player.deck.useCardByType('nope');
    console.log(usedCard);

    const move = room.history.current;
    move.addCards(usedCard).then(console.log).catch(console.error);
    move.timer.stopTimer();

    bridge.emit(room.id, 'stopTimer');
    bridge.emit(room.id, 'updateMove', { cards: move.allCards });
    gameUpdate(bridge, room);
  });

  bridge.on('playerMove', (socket, { room, name, cards, options }) => {
    console.log('player move');
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    const currentPlayer = room.currentPlayer;

    if (player.name !== currentPlayer.name) {
      return;
    }

    console.log('new move');

    if (!room.history.current) {
      newMove(bridge, room, player);
    }

    const move = room.history.current;

    // TODO check for cheats
    cards.forEach(card => player.deck.useCard(card.id));
    gameUpdate(bridge, room, player.name);

    room.history.newMove(move);

    move.addCards(cards, options).then(() => {
      cardsApply(bridge, cards, room, socket, options);
    }).catch(console.error);

    bridge.emit(room.id, 'updateMove', { cards: move.allCards });
  });

  bridge.on('getAllCardsType', (socket) => {
    bridge.emit(socket.id, 'showCardList', {
      deck: Room.getAllCardsTypes(),
    });
  });

  bridge.on('disconnect', (socket) => {
    console.log('disconnect...');
    console.log(socket);
  });

  // dev commands

  bridge.on('_getCard', (socket, { room, name, options }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CHEATS', room, name);

    const [ cardType ] = options;

    console.log('player get cheat card', cardType);
    player.deck.addCard(Card.newCard(cardType));

    gameUpdate(bridge, room);
  });

  bridge.on('_getDefuse', (socket, { room, name }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CHEATS', room, name);
    player.deck.addCard(Card.newCard('defuse'));

    gameUpdate(bridge, room);
  });

  bridge.on('_shuffle', (socket, { room, name }) => {
    room.deck.shuffle();

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CHEATS', room, name);
    gameUpdate(bridge, room);
  });

  bridge.on('_showGameDeck', (socket, { room, name }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    const showTime = 10000;

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CHEATS', room, name);
    bridge.emit(socket.id, '_showCurrentGameDeck', { deck: room.deck.cards, timer: showTime });

    const hideDeckTimeout = setTimeout(() => {
      bridge.emit(socket.id, '_hideCurrentGameDeck');
      clearTimeout(hideDeckTimeout);
    }, showTime);
  });
}
