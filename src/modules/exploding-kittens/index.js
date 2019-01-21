import ioStarter from './socket';
import Room      from './entities/Room';
import Card      from './entities/Card';
import Move      from './entities/Move';

export default function init() {
  const io = ioStarter('/ws/exploding-kittens');

  const rooms = [];

  const getRoom = (roomId) => rooms.find(room => room.id === roomId);

  const sendGameMessage = (text, roomId, name, options = {}) => {
    const room = getRoom(roomId);
    console.log('send message to', roomId);

    if (!room) return false;

    io.to(room.id).emit('gameMessage', {
      text: text,
      options: {
        player: name || room.currentPlayer.name,
        ...options,
      },
    });
  };

  const newMove = (room, player) => {
    room.history.newMove(new Move({
      who: player,
      whom: room.nextPlayer(true),

      onTimer(card) {
        console.log('on timer');
        room.players.forEach((player) => {
          if (player.name === this.who.name) {
            return;
          }

          const playerHasStop = player.deck.hasCardOfType('nope');
          console.log('send start timer to', player.name);
          io.to(player.id).emit('startActionTimer', {
            card,
            time: 5000,
            actionEnabled: playerHasStop,
          })
        });
      }
    }));
  };

  const cardsApply = (cards, room, socket) => {
    const player = room.currentPlayer;

    if (cards.length === 1) {
      const [ card ] = cards;

      console.log(card);

      switch (card.props.type) {
        case 'shuffle':
          room.deck.shuffle();

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE', room.id);
          gameUpdate(room.id);

          break;

        case 'see-the-future':
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', room.id);
          gameUpdate(room.id);

          io.to(player.id).emit('seeTheFuture', room.deck.cards.slice(-3));

          break;

        case 'skip':
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SKIP', room.id);

          if (!room.playerEndMove()) {
            room.nextPlayer();
          }

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', room.id);
          gameUpdate(room.id);

          break;

        case 'nope':
          const previousPart = room.history.current.parts[room.history.current.parts.length - 2];
          cardsCancel(previousPart.cards, room, socket);

          break;

        case 'favor':
          const favorPlayer = room.nextPlayer(true);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_FAVOR', room.id, player.name, {
            whom: favorPlayer.name,
          });
          gameUpdate(room.id);

          console.log('send favor event to', favorPlayer.name);
          io.to(favorPlayer.id).emit('playerUseFavor');

          socket.on('playerSelectFavorCard', (cardId) => {
            console.log('favor player choose card', cardId);
            player.deck.addCard(...favorPlayer.deck.useCard(cardId));

            gameUpdate(room.id);
          });

          break;

        default:
          break;
      }
    }
  };

  const cardsCancel = (cards, room, socket) => {
    if (cards.length === 1) {
      const [ card ] = cards;

      console.log(card);

      switch (card.props.type) {
        case 'skip':
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_BLOCK_SKIP', room.id);

          room.previousPlayer();

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', room.id);
          gameUpdate(room.id);

          break;

        case 'nope':
          const applyingPart = room.history.current.parts[room.history.current.parts.length - 3];
          cardsApply(applyingPart.cards, room, socket);

          break;

        default:
          break;
      }
    }
  };

  const playerConnect = (playerName, roomId, socket) => {
    console.log('player connect', playerName);
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
    const currentPlayer = room.currentPlayer.name;
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
    console.log('connected', socket.id);
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

    socket.on('getTrash', ({ roomId }, callback) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      callback(room.trash);
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

      const oldMove = room.history.current;

      if (oldMove) {
        oldMove.endMove();
        room.trash.push(...oldMove.allCards);
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
      } else {
        player.deck.addCard(card);
      }

      if (!room.playerEndMove()) {
        room.nextPlayer();
      }

      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
      newMove(room, room.currentPlayer);
      io.to(room.id).emit('updateMove', room.history.current.allCards);
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

    socket.on('stopAction', ({ roomId, name }) => {
      console.log('stop action');
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      const usedCard = player.deck.useCardByType('nope');
      console.log(usedCard);

      const move = room.history.current;
      move.addCards(usedCard).then(console.log).catch(console.error);
      move.timer.stopTimer();
      io.to(room.id).emit('updateMove', move.allCards);
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

      console.log('new move');

      if (!room.history.current) {
        newMove(room, player);
      }

      const move = room.history.current;

      // TODO check for cheats
      cards.forEach(card => player.deck.useCard(card.id));
      gameUpdate(roomId, player.name);

      room.history.newMove(move);

      move.addCards(cards).then(() => {
        cardsApply(cards, room, socket);
      }).catch(console.error);

      io.to(room.id).emit('updateMove', move.allCards);
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
      console.log('disconnect...');
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
