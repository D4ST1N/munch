import ioStarter from './socket';
import Room      from './entities/Room';
import Card      from './entities/Card';
import Move      from './entities/Move';
import shuffle   from '../../utils/shuffle';

export default function init() {
  const io = ioStarter('/ws/exploding-kittens');

  const rooms = [];

  const getRoom = (roomId) => {
    const room = rooms.find(room => room.id === roomId);

    if (!room || room.status === 'ended') {
      return false;
    }

    return room;
  };

  const sendGameMessage = (text, roomId, name, options = {}) => {
    const room = getRoom(roomId);
    console.log('send message to', roomId);

    if (!room) return false;

    const message = {
      text: text,
      options: {
        player: name || room.currentPlayer.name,
        ...options,
      },
    };

    io.to(room.id).emit('gameMessage', message);
  };

  const newMove = (room, player) => {
    room.history.newMove(new Move({
      who: player,

      onTimer(cards, time, moveOptions) {
        console.log('on timer');
        io.to(room.id).emit('startTimer', time);
        room.players.forEach((player) => {
          if (player.name === this.who.name) {
            return;
          }

          const playerHasStop = player.deck.hasCardOfType('nope');
          console.log('send start timer to', player.name);

          let title;
          let text = 'NOTIFICATIONS.GAME.TIME_TO_STOP';
          let options = {
            player: this.who.name,
          };

          switch (cards.length) {
            case 1:
              title = 'NOTIFICATIONS.GAME.PLAYER_USE_CARD';
              options.card = cards[0].props.name;
              break;
            case 2:
              title = 'NOTIFICATIONS.GAME.PLAYER_USE_TWO_CARDS_COMBO';
              options.whom = moveOptions.name;
              break;
            case 3:
              title = 'NOTIFICATIONS.GAME.PLAYER_USE_THREE_CARDS_COMBO';
              options.whom = moveOptions.name;
              options.card = moveOptions.card.props.name;
              break;
            case 5:
              title = 'NOTIFICATIONS.GAME.PLAYER_USE_FIVE_CARDS_COMBO';
              break;
            default:
              break;
          }
          io.to(player.id).emit('startActionTimer', {
            title,
            text,
            cards,
            time,
            options,
            actionEnabled: playerHasStop,
          })
        });
      },
    }));
  };

  const cardsApply = (cards, room, socket, options) => {
    const player = room.currentPlayer;
    console.log('Cards apply');

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

        case 'attack':
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_ATTACK', room.id);

          room.nextPlayer();
          room.penaltyMoves += 2;

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', room.id);
          gameUpdate(room.id);

          break;

        case 'nope':
          const previousPart = room.history.current.parts[room.history.current.parts.length - 2];
          cardsCancel(previousPart.cards, room, socket, options);

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
    } else if (cards.length === 2) {
      console.log('choose player card');
      const selectedPlayer = room.getPlayer(options.name);

      io.to(player.id).emit('showCardList', {
        deck: shuffle([...selectedPlayer.deck.inverted]),
        event: 'selectPlayerCard',
      });

      socket.on('selectPlayerCard', ({ card }) => {
        player.deck.addCard(...selectedPlayer.deck.useCard(card.id));
        gameUpdate(room.id);
        socket.removeAllListeners('selectPlayerCard');
      });
    } else if (cards.length === 3) {
      console.log('get player card');
      const selectedPlayer = room.getPlayer(options.name);
      const selectedCard = options.card;
      const selectedPlayerHasCard = selectedPlayer.deck.hasCardOfType(selectedCard.props.type);

      if (selectedPlayerHasCard) {
        player.deck.addCard(...selectedPlayer.deck.useCardByType(selectedCard.props.type));
        gameUpdate(room.id);
      } else {
        io.to(player.id).emit('gameMessage', {
          text: 'NOTIFICATIONS.GAME.PLAYER_HAS_NOT_CARD',
        });
      }
    } else if (cards.length === 5) {
      console.log('select from trash');
      io.to(player.id).emit('showCardList', {
        deck: room.trash.cards,
        event: 'selectTrashCard',
      });

      socket.on('selectTrashCard', ({ card }) => {
        player.deck.addCard(...room.trash.useCard(card.id));
        gameUpdate(room.id);
        socket.removeAllListeners('selectTrashCard');
      });
    }
  };

  const cardsCancel = (cards, room, socket, options) => {
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

        case 'attack':
          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_BLOCK_ATTACK', room.id);

          room.previousPlayer();
          room.penaltyMoves -= 2;

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

    socket.broadcast.emit('newGameStarted');

    socket.join(room.id);

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
        gameTrash: room.trash.cards,
        playerDeck: player.deck.cards,
      });
    } else {
      room.players.forEach((player) => {
        console.log('send game update to ', player.name);
        io.to(player.id).emit('gameUpdate', {
          players,
          currentPlayer,
          gameDeck: invertedDeck,
          gameTrash: room.trash.cards,
          playerDeck: player.deck.cards,
        });
      });
    }
  };

  const getRoomsList = (rooms, playerName) => {
    return rooms
      .filter(room => room.status !== 'ended')
      .map(room => {
        const reconnected = room.getPlayer(playerName);
        const gameStarted = room.gameStarted;
        const canJoin = (reconnected && gameStarted) || !gameStarted;

        return Object.assign({}, room, { canJoin })
    });
  };

  io.on('connection', (socket) => {
    console.log('connected', socket.id);
    socket.emit('roomList', rooms);

    socket.on('knockKnock', ({ roomId }, callback) => {
      console.log('Knock Knock');
      callback(!!getRoom(roomId));
    });

    socket.on('getRoomList', (playerName, callback) => {
      const roomsArray = getRoomsList(rooms, playerName);

      callback(roomsArray);
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

      callback(room.trash.cards);
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
        oldMove.allCards.forEach(card => room.trash.addCard(card, false));
      }

      const card = room.deck.useUpperCard();

      console.log('player get', card.props.type, 'card');

      if (card.props.type === 'exploding-kitten') {
        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_GET_EXPLODING_KITTEN', roomId, name);

        if (player.deck.isCardExist('defuse')) {
          console.log('player has defuse');

          room.trash.addCard(...player.deck.useCardByType('defuse'), false);
          room.deck.addCard(card);

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_DEFUSE_EXPLODING_KITTEN', roomId, name);
        } else {
          console.log('player exploded');

          player.exploded = true;

          sendGameMessage('NOTIFICATIONS.GAME.PLAYER_EXPLODED', roomId, name);
          io.to(player.id).emit('endGame', false);

          if (room.gameEnded) {
            const winner = room.players.find(player => !player.exploded);

            sendGameMessage('NOTIFICATIONS.GAME.PLAYER_WIN', roomId, winner.name);
            io.to(winner.id).emit('endGame', true);

            room.gameEnd();
            return;
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

    socket.on('createRoom', (playerName) => {
      console.log('create room');

      rooms.push(new Room());

      const roomsArray = getRoomsList(rooms, playerName);

      io.emit('roomList', roomsArray);
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

      io.emit('newGameStarted');

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
      io.to(room.id).emit('stopTimer');
      io.to(room.id).emit('updateMove', move.allCards);
      gameUpdate(roomId);
    });

    socket.on('playerMove', ({ roomId, name, cards, options }) => {
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

      move.addCards(cards, options).then(() => {
        cardsApply(cards, room, socket, options);
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

    socket.on('getAllCardsType', (callback) => {
      callback(Room.getAllCardsTypes());
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

      console.log('player get cheat card', cardType);
      player.deck.addCard(Card.newCard(cardType));

      gameUpdate(roomId);
    });

    socket.on('_getDefuse', ({ roomId, name }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      player.deck.addCard(Card.newCard('defuse'));

      gameUpdate(roomId);
    });

    socket.on('_shuffle', ({ roomId, name }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      room.deck.shuffle();

      sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE_CHEAT', roomId, name);

      gameUpdate(roomId);
    });

    socket.on('_showGameDeck', ({ roomId, name }) => {
      const room = getRoom(roomId);

      if (!room) {
        return;
      }

      const player = room.getPlayer(name);

      if (!player) {
        return;
      }

      io.to(socket.id).emit('_showCurrentGameDeck', { deck: room.deck.cards, timer: 10000 });

      const hideDeckTimeout = setTimeout(() => {
        const user = socket.id;
        io.to(user).emit('_hideCurrentGameDeck');
        clearTimeout(hideDeckTimeout);
      }, 10000)
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
