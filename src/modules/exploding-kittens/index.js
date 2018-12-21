import socketIO            from 'socket.io';
import uuid                from 'uuid/v1';
import config              from '../../configs/exploding-kittens';
import addCards            from './addCards';
import shuffle             from '../../utils/shuffle';
import getPlayerStartCards from './getPlayerStartCards';

export default function init(server) {
  const io = socketIO(server, { path: '/ws/exploding-kittens'});

  const rooms = [];
  const deck = [];

  const getRoom = (roomId) => rooms.find(room => room.id === roomId);

  const getPlayer = (room, playerName) => room.players.find(player => player.name === playerName);

  const isGameStarted = (roomId) => {
    const room = getRoom(roomId);

    if (!room) return false;

    console.log(room.players);
    return !room.players.find(player => player.ready === false) && room.players.length > 1;
  };

  const playerConnect = (playerName, roomId, socket) => {
    const room = getRoom(roomId);

    if (!room) {
      return;
    }

    const player = getPlayer(room, playerName);

    if (player) {
      console.log('Player reconnected: ', playerName);

      player.active = true;
    } else {
      console.log('Player joined: ', playerName);

      room.players.push({
        name: playerName,
        ready: false,
        id: socket.id,
        active: true,
      });
    }

    socket.join(room.id);

    io.emit('roomList', rooms);
    io.to(room.id).emit('gameStatus', room.players);
  };

  config.cards.forEach((cardConfig) => {
    addCards(deck, cardConfig);
  });

  io.on('connection', (socket) => {
    socket.emit('roomList', rooms);

    socket.on('knockKnock', (roomId, callback) => {
      console.log('Knock Knock');
      callback(!!getRoom(roomId));
    });

    socket.on('getRoomList', (callback) => {
      callback(rooms);
    });

    socket.on('getGameStatus', (roomId, callback) => {
      console.log(isGameStarted(roomId));
      callback(isGameStarted(roomId));
    });

    socket.on('getPlayerDeck', ({ roomId, name }, callback) => {
      callback(getPlayer(getRoom(roomId), name).deck);
    });

    socket.on('createRoom', () => {
      console.log('create room');

      rooms.push({
        id: uuid(),
        players: [],
      });

      io.emit('roomList', rooms);
    });
    // io.sockets.emit('deck', shuffle(deck));
    // io.sockets.emit('deck', getPlayerStartCards(deck));
    // io.sockets.emit('gameStatus', players);

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

      io.to(roomId).emit('gameStatus', room.players);

      if (!isGameStarted(roomId)) {
        return;
      }

      shuffle(deck);

      io.to(roomId).emit('gameStart');

      room.players.forEach((player) => {
        console.log('send deck to player ', player.name);

        player.deck = getPlayerStartCards(deck);
        io.to(player.id).emit('deck', player.deck);
      });
    });

    socket.on('playerReconnect', (playerName) => {
      console.log('Player reconnected: ', playerName);
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
