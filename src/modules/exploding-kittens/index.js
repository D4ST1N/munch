import socketIO            from 'socket.io';
import uuid                from 'uuid/v1';
import config              from '../../configs/exploding-kittens';
import addCards            from './addCards';
import shuffle             from '../../utils/shuffle';
import getPlayerStartCards from './getPlayerStartCards';
import randomInt           from '../../utils/randomInt';

export default function init(server) {
  const io = socketIO(server, { path: '/ws/exploding-kittens'});

  const rooms = [];

  const getRoom = (roomId) => rooms.find(room => room.id === roomId);

  const getPlayer = (room, playerName) => room.players.find(player => player.name === playerName);

  const invertDeck = (deck) => deck.map((card) => ({ inverted: true, id: card.id }));

  const getCardIndex = (deck, cardType) => deck.findIndex((card) => card.props.type === cardType);

  const nextPlayer = (room) => {
    room.playerIndex++;

    if (room.playerIndex === room.players.length) {
      room.playerIndex = 0;
    }

    if (room.players[room.playerIndex].exploded) {
      nextPlayer(room);
    }
  };

  const sendGameMessage = (text, roomId, name) => {
    const room = getRoom(roomId);
    console.log('send message to', roomId);

    if (!room) return false;

    io.to(room.id).emit('gameMessage', {
      text: text,
      options: {
        player: name || room.players[room.playerIndex].name,
      },
    });
  };

  const playerUseCard = (player, cardId) => {
    console.log('Player use card', cardId);
    const index = player.deck.findIndex(card => card.id === cardId);

    if (index !== -1) {
      player.deck.splice(index, 1);
    }
  };

  const isGameStarted = (roomId) => {
    const room = getRoom(roomId);

    if (!room) return false;

    if (room.status === 'started') return true;

    return !room.players.find(player => player.ready === false) && room.players.length > 1;
  };

  const isGameEnded = (room) => {
    return room.players.filter(player => !player.exploded).length === 1;
  };

  const gameStart = (room) => {
    config.cards.forEach((cardConfig) => {
      addCards(room.deck, cardConfig);
    });

    shuffle(room.deck);

    room.players.forEach((player) => {
      player.deck = getPlayerStartCards(room.deck);
    });
  };

  const playerConnect = (playerName, roomId, socket) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    const player = getPlayer(room, playerName);
    let personal = false;

    if (player) {
      console.log('Player reconnected: ', playerName);

      player.id = socket.id;
      player.active = true;
      personal = true;
    } else {
      console.log('Player joined: ', playerName);

      room.players.push({
        name: playerName,
        ready: false,
        id: socket.id,
        active: true,
        exploded: false,
      });
    }

    console.log(room.status, isGameStarted(room.id));
    console.log('join room');
    socket.join(room.id);

    socket.broadcast.emit('roomList', rooms);

    if (isGameStarted(room.id)) {
      io.to(socket.id).emit('gameStart');
      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      gameUpdate(room.id, personal ? playerName : false);
    } else {
      io.to(room.id).emit('gameStatus', room.players);
    }
  };

  const getPlayersList = (room) => {
    return room.players.map((player) => ({
      name: player.name,
      exploded: player.exploded,
    }));
  };

  const gameUpdate = (roomId, name) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    const invertedDeck = invertDeck(room.deck);
    const currentPlayer = room.players[room.playerIndex].name;
    const players = getPlayersList(room);

    console.log('gameUpdate');
    if (name) {
      const player = getPlayer(room, name);
      console.log('send game update to ', player.name);
      io.to(player.id).emit('gameUpdate', {
        players,
        currentPlayer,
        gameDeck: invertedDeck,
        gameTrash: room.trash,
        playerDeck: player.deck,
      });
    } else {
      room.players.forEach((player) => {
        console.log('send game update to ', player.name);
        io.to(player.id).emit('gameUpdate', {
          players,
          currentPlayer,
          gameDeck: invertedDeck,
          gameTrash: room.trash,
          playerDeck: player.deck,
        });
      });
    }
  };

  io.on('connection', (socket) => {
    socket.emit('roomList', rooms);

    socket.on('knockKnock', ({ roomId }, callback) => {
      console.log('Knock Knock');
      callback(!!getRoom(roomId));
    });

    socket.on('getRoomList', (callback) => {
      callback(rooms);
    });

    socket.on('getGameStatus', ({ roomId }, callback) => {
      console.log('getGameStatus');
      callback(isGameStarted(roomId));
    });

    socket.on('getPlayerDeck', ({ roomId, name }, callback) => {
      console.log(getRoom(roomId), getPlayer(getRoom(roomId), name));
      callback(getPlayer(getRoom(roomId), name).deck);
    });

    socket.on('getDeck', ({ roomId }, callback) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      callback(invertDeck(room.deck));
    });

    socket.on('playerGetCard', ({ roomId, name }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = room.players[room.playerIndex];

      if (player.name !== name) {
        return;
      }

      const card = room.deck.pop();

      console.log('player get', card.props.type, 'card');

      if (card.props.type === 'exploding-kitten') {
        const defuseIndex = getCardIndex(player.deck, 'defuse');
        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_GET_EXPLODING_KITTEN', roomId, name);

        if (defuseIndex !== -1) {
          console.log('player has defuse');

          room.trash.push(...player.deck.splice(defuseIndex, 1));
          room.deck.splice(randomInt(0, room.deck.length - 1), 0, card);
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_DEFUSE_EXPLODING_KITTEN', roomId, name);
        } else {
          console.log('player exploded');

          player.exploded = true;
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_EXPLODED', roomId, name);

          if (isGameEnded(room)) {
            const winner = room.players.find(player => !player.exploded);
            sendGameMessage('NOTIFICATIONS.GAME.PLAYER_WIN', roomId, winner.name);
          }
        }

        nextPlayer(room);
        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
        gameUpdate(roomId);

        return;
      }

      player.deck.push(card);

      nextPlayer(room);
      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      gameUpdate(roomId);
    });

    socket.on('getPlayersList', ({ roomId }, callback) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      console.log(room.playerIndex, room.players[room.playerIndex].name);
      callback(room.players.map((player) => ({
        name: player.name,
        current: room.players[room.playerIndex].name === player.name,
      })));
    });

    socket.on('createRoom', () => {
      console.log('create room');

      rooms.push({
        id: uuid(),
        players: [],
        deck: [],
        trash: [],
        playerIndex: 0,
        status: 'wait'
      });

      io.emit('roomList', rooms);
    });

    socket.on('playerJoin', ({ name, roomId }) => {
      playerConnect(name, roomId, socket);
    });

    socket.on('playerReady', ({ name, roomId }) => {
      console.log('Player ready: ', name);

      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = getPlayer(room, name);

      if (!player) {
        return;
      }

      player.ready = true;

      console.log('emit status', player.name);
      io.to(room.id).emit('gameStatus', room.players);

      if (!isGameStarted(roomId)) {
        return;
      }

      room.status = 'started';
      gameStart(room);

      console.log('game start');
      io.to(room.id).emit('gameStart');

      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      gameUpdate(roomId);
    });

    socket.on('playerMove', ({ roomId, name, cards }) => {
      console.log('player move');
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = getPlayer(room, name);

      if (!player) {
        return;
      }

      if (cards.length === 1) {
        const [ card ] = cards;

        console.log(card);

        if (card.props.type === 'shuffle') {
          shuffle(room.deck);

          playerUseCard(player, card.id);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE', roomId, name);
          gameUpdate(roomId);
        }

        if (card.props.type === 'see-the-future') {
          playerUseCard(player, card.id);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', roomId, name);
          gameUpdate(roomId);

          io.to(player.id).emit('seeTheFuture', room.deck.slice(-3));
        }
      }
    });

    socket.on('endSeeTheFuture', ({ roomId }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      gameUpdate(roomId);
    });

    socket.on('_getCard', ({ roomId, name, options }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = getPlayer(room, name);

      if (!player) {
        return;
      }

      const [ cardType ] = options;
      const cardConfig = config.cards.find(cardConfig => cardConfig.type === cardType);
      addCards(player.deck, cardConfig, 1);
      console.log(player.deck);

      gameUpdate(roomId);
    });

    socket.on('disconnect', () => {
      rooms.forEach((room) => {
        const disconnectedPlayer = room.players.find(player => player.id === socket.id);

        if (disconnectedPlayer) {
          console.log('disconnected ', disconnectedPlayer.name);
        }
      });
    });
  });
}
