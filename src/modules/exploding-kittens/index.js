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
import writeLog        from './helpers/writeLog';
import playerGetCard   from './helpers/playerGetCard';
import playerMove      from './helpers/playerMove';
import stopAction from './helpers/stopAction';
import getCardsList from './helpers/getCardsList';

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

  bridge.on('createRoom', (socket, { name, options }) => {
    Rooms.push(new Room(name, options));

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

    if (!player || player.ready) {
      return;
    }

    player.ready = true;

    console.log('emit status', player.name);
    bridge.emit(
      room.id,
      'gameStatus',
      {
        players: room.players,
        cards: getCardsList(room),
        settings: room.settings,
      },
    );

    if (!room.gameStarted) {
      return;
    }

    room.gameStart();

    console.log('game start');

    bridge.emitAll('newGameStarted');
    bridge.emit(room.id, 'gameStart', { players: room.players });
    // sendGameMessage(bridge, room, {
    //   key: 'GAME.LOGS.PLAYER_TURN',
    // });
    gameUpdate(bridge, room);
  });

  bridge.on('stopAction', (socket, { room, name }) => {
    stopAction(bridge, socket, { room, name });
  });

  bridge.on('playerMove', (socket, payload) => {
    playerMove(bridge, socket, payload);
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

    if (!room.deck.useCardByName('exploding-kitten')) {
      room.deck.useCardByName('imploding-kitten');
    }

    room.killPlayer(name);

    if (room.gameEnded) {
      const winner = room.players[0];

      sendGameMessage(bridge, room, {
        key: 'NOTIFICATIONS.GAME.PLAYER_WIN',
        who: winner.name,
      });
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

    if (!options.includes('--quite')) {
      sendGameMessage(bridge, room, {
        key: 'GAME.LOGS.PLAYER_USE_CHEATS',
        who: name,
      });
    }

    const [cardName] = options;

    console.log('player get cheat card', cardName);
    player.deck.addCard(Card.newCard(cardName));

    gameUpdate(bridge, room);
  });

  bridge.on('_givePlayerCard', (socket, { room, name, options }) => {
    const [playerName, cardName] = options;
    const player = room.getPlayer(playerName);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });

    player.deck.addCard(Card.newCard(cardName));

    gameUpdate(bridge, room);
  });

  bridge.on('_removeCard', (socket, { room, name, options }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });

    const [cardName] = options;

    player.deck.useCardByName(cardName);

    gameUpdate(bridge, room);
  });

  bridge.on('_removePlayerCard', (socket, { room, name, options }) => {
    const [playerName, cardName] = options;
    const player = room.getPlayer(playerName);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    player.deck.useCardByName(cardName);

    gameUpdate(bridge, room);
  });

  bridge.on('_getDefuse', (socket, { room, name }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    player.deck.addCard(Card.newCard('defuse'));

    gameUpdate(bridge, room);
  });

  bridge.on('_shuffle', (socket, { room, name }) => {
    room.deck.shuffle();

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    gameUpdate(bridge, room);
  });

  bridge.on('_showGameDeck', (socket, { room, name }) => {
    const player = room.getPlayer(name);

    if (!player) {
      return;
    }

    const showTime = 10000;

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    bridge.emit(socket.id, 'showCardList', { deck: room.deck.cards, timer: showTime });

    const hideDeckTimeout = setTimeout(() => {
      bridge.emit(socket.id, 'hideCardList');
      clearTimeout(hideDeckTimeout);
    }, showTime);
  });

  bridge.on('_showPlayerCards', (socket, { room, name, options }) => {
    const player = room.getPlayer(name);
    const [ playerName ] = options;
    const chosenPlayer = room.getPlayer(playerName);
    console.log(player, chosenPlayer);

    if (!player || !chosenPlayer) {
      return;
    }


    const showTime = 10000;

    bridge.emit(player.id, 'showCardList', { deck: chosenPlayer.deck.cards, timer: showTime });

    const hideDeckTimeout = setTimeout(() => {
      console.log('now');
      bridge.emit(player.id, 'hideCardList');
      clearTimeout(hideDeckTimeout);
    }, showTime);
  });

  bridge.on('_saveLogs', (socket, { room }) => {
    writeLog(room.id, room.logs);
  });


  bridge.on('_reverse', (socket, { room }) => {
    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    room.reverse();
    gameUpdate(bridge, room);
  });

  bridge.on('_killPlayer', (socket, { room, name, options }) => {
    const [ playerName ] = options;

    if (!room.getPlayer(playerName)) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    room.killPlayer(playerName);
    gameUpdate(bridge, room);
  });

  bridge.on('_changeCurrentPlayer', (socket, { room, name, options }) => {
    const [ playerName ] = options;

    if (!room.getPlayer(playerName)) {
      return;
    }

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_USE_CHEATS',
      who: name,
    });
    room.nextPlayer(playerName);
    gameUpdate(bridge, room);
  });
}
