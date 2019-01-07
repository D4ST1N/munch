import socketIO from 'socket.io';
import Room     from './entities/Room';
import Card     from './entities/Card';

export default function init(server) {
  const io = socketIO(server, { path: '/ws/exploding-kittens'});

  const rooms = [];

  const getRoom = (roomId) => rooms.find(room => room.id === roomId);

  const sendGameMessage = (text, roomId, name) => {
    const room = getRoom(roomId);
    console.log('send message to', roomId);

    if (!room) return false;

    io.to(room.id).emit('gameMessage', {
      text: text,
      options: {
        player: name || room.currentPlayer.name,
      },
    });
  };

  const playerConnect = (playerName, roomId, socket) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    const reconnected = room.playerConnect(playerName, socket.id);

    console.log('join room');
    socket.join(room.id);

    socket.broadcast.emit('roomList', rooms);

    if (room.gameStarted) {
      console.log('game started!');
      io.to(socket.id).emit('gameStart');

      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      gameUpdate(room.id, reconnected ? playerName : false);
    } else {
      io.to(room.id).emit('gameStatus', room.players);
    }
  };

  const gameUpdate = (roomId, name) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    const invertedDeck = room.invertedDeck;
    const currentPlayer = room.currentPlayer;
    const players = room.playersList();

    console.log('gameUpdate');
    if (name) {
      const player = room.getPlayer(name);
      console.log('send game update to ', player.name);
      io.to(player.id).emit('gameUpdate', {
        players,
        currentPlayer,
        gameDeck: invertedDeck,
        gameTrash: room.trash,
        playerDeck: player.deck.cards,
      });
    } else {
      room.players.forEach((player) => {
        console.log('send game update to ', player.name);
        console.log(player);
        io.to(player.id).emit('gameUpdate', {
          players,
          currentPlayer,
          gameDeck: invertedDeck,
          gameTrash: room.trash,
          playerDeck: player.deck.cards,
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

    socket.on('getDeck', ({ roomId }, callback) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      callback(room.invertedDeck);
    });

    socket.on('playerGetCard', ({ roomId, name }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = room.currentPlayer;

      if (player.name !== name) {
        return;
      }

      const card = room.deck.useUpperCard();

      console.log('player get', card.props.type, 'card');

      if (card.props.type === 'exploding-kitten') {
        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_GET_EXPLODING_KITTEN', roomId, name);

        if (player.deck.isCardExist('defuse')) {
          console.log('player has defuse');

          room.trash.push(...player.deck.useCardByType('defuse'));
          room.deck.addCard(card);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_DEFUSE_EXPLODING_KITTEN', roomId, name);
        } else {
          console.log('player exploded');

          player.exploded = true;

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_EXPLODED', roomId, name);

          if (room.gameEnded) {
            const winner = room.players.find(player => !player.exploded);

            sendGameMessage('NOTIFICATIONS.GAME.PLAYER_WIN', roomId, winner.name);
          }
        }

        room.nextPlayer();

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
        gameUpdate(roomId);

        return;
      }

      player.deck.addCard(card);

      room.nextPlayer();

      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      gameUpdate(roomId);
    });

    socket.on('createRoom', () => {
      console.log('create room');

      rooms.push(new Room());

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

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      player.ready = true;

      console.log('emit status', player.name);
      io.to(room.id).emit('gameStatus', room.players);


      if (!room.gameStarted) {
        return;
      }

      room.gameStart();

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

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      const currentPlayer = room.currentPlayer;

      if (player.name !== currentPlayer.name) {
        return;
      }

      if (cards.length === 1) {
        const [ card ] = cards;

        console.log(card);

        if (card.props.type === 'shuffle') {
          room.deck.shuffle();

          player.deck.useCard(card.id);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE', roomId, name);
          gameUpdate(roomId);
        }

        if (card.props.type === 'see-the-future') {
          player.deck.useCard(card.id);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', roomId, name);
          gameUpdate(roomId);

          io.to(player.id).emit('seeTheFuture', room.deck.cards.slice(-3));
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

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      const [ cardType ] = options;

      player.deck.addCard(Card.newCard(cardType));

      gameUpdate(roomId);
    });

    socket.on('disconnect', () => {
      rooms.forEach((room) => {
        const disconnectedPlayer = room.players.find(player => player.id === socket.id);

        if (disconnectedPlayer) {
          disconnectedPlayer.disconnect();
          console.log('disconnected ', disconnectedPlayer.name);
        }
      });
    });
  });
}
