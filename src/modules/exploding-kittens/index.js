import ioStarter       from './socket';
import Rooms           from './entities/Rooms';
import Room            from './entities/Room';
import Card            from './entities/Card';
import EventBridge     from './entities/EventBridge';
import getRoom         from './helpers/getRoom';
import sendGameMessage from './helpers/sendGameMessage';
import getRoomsList    from './helpers/getRoomsList';
import gameUpdate      from './helpers/gameUpdate';
import playerConnect   from './helpers/playerConnect';
import newMove         from './helpers/newMove';
import cardsApply      from './helpers/cardsApply';
import isNopeCard      from './helpers/hasNopeCard';
import writeLog        from './helpers/writeLog';
import playerGetCard   from './helpers/playerGetCard';

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
    playerGetCard(bridge, room, name);
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
    bridge.emit(room.id, 'gameStatus', { players: room.players, watchers: room.watchers });
    room.logs.push({
      text: 'LOGS.PLAYER_READY',
      options: {
        player: name,
      },
    });

    if (!room.gameStarted) {
      return;
    }

    room.gameStart();

    console.log('game start');

    bridge.emitAll('newGameStarted');
    bridge.emit(room.id, 'gameStart', { players: room.players });
    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
    gameUpdate(bridge, room);
    room.logs.push({
      text: 'LOGS.GAME_STARTED',
    });
    room.logs.push({
      text: 'LOGS.START_DECK',
      deck: [...room.deck.cards],
    });
    room.players.forEach((player) => {
      room.logs.push({
        text: 'LOGS.PLAYER_DECK',
        options: {
          player: player.name,
        },
        deck: [...player.deck.cards],
      });
    });
    room.logs.push({
      text: 'LOGS.PLAYER_MOVE',
      options: {
        player: room.currentPlayer.name,
      },
    });
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
    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_ACTION', room, player.name, {
      personalized: false,
    });
    gameUpdate(bridge, room);
    room.logs.push({
      text: 'LOGS.PLAYER_BLOCK_ACTION',
      options: {
        player: name,
      },
    });
  });

  bridge.on('playerMove', (socket, { room, name, cards, options }) => {
    console.log('player move');
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    const currentPlayer = room.currentPlayer;

    if (player.name !== currentPlayer.name && !isNopeCard(cards)) {
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
    room.logs.push({
      text: 'LOGS.PLAYER_MAKE_MOVE',
      options: {
        player: name,
      },
      deck: [...cards],
    });

    room.history.newMove(move);

    move.addCards(cards, options).then(() => {
      if (isNopeCard(cards) && move.timer) {
        move.timer.stopTimer();
        bridge.emit(room.id, 'stopTimer');
      }

      cardsApply(bridge, cards, room, socket, options);
    }).catch(console.error);

    bridge.emit(room.id, 'updateMove', { cards: move.allCards });
  });

  bridge.on('getAllCardsType', (socket) => {
    bridge.emit(socket.id, 'showCardList', {
      deck: Room.getAllCardsTypes().cards,
    });
  });

  bridge.on('getRoomLogs', (socket, { room, event }) => {
    console.log('getRoomLogs');
    const data = {
      status: room.status,
      logs: room.status === 'ended' ? room.logs : [],
    };
    bridge.emit(socket.id, event, data);
  });

  bridge.on('playerLeave', (socket, { room, name }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    room.killPlayer(name);

    if (room.gameEnded) {
      const winner = room.players[0];

      sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_WIN', room, winner.name);
      bridge.emit(winner.id, 'endGame', { win: true });

      room.gameEnd();
      room.logs.push({
        text: 'LOGS.PLAYER_WIN',
        options: {
          player: player.name,
        },
      });
    }

    gameUpdate(bridge, room);
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

  bridge.on('_saveLogs', (socket, { room }) => {
    writeLog(room.id, room.logs);
  });
}
