import socketIO            from 'socket.io';
import config              from '../../configs/exploding-kittens';
import addCards            from './addCards';
import shuffle             from '../../utils/shuffle';
import getPlayerStartCards from './getPlayerStartCards';

export default function init(server) {
  const io = socketIO(server, { path: '/ws/exploding-kittens'});

  const deck = [];
  const players = [];

  config.cards.forEach((cardConfig) => {
    addCards(deck, cardConfig);
  });

  io.on('connection', (socket) => {
    // io.sockets.emit('deck', shuffle(deck));
    // io.sockets.emit('deck', getPlayerStartCards(deck));
    io.sockets.emit('gameStatus', players);

    socket.on('playerJoin', (playerName) => {
      console.log('Player joined: ', playerName);

      if (players[playerName]) {
        console.log('Player reconnect: ', playerName);

        players[playerName].id = socket.id;
        players[playerName].active = true;

        if (players[playerName].ready) {
          console.log('send deck to player ', playerName);

          io.sockets.emit('gameStart');
          io.to(players[playerName].id).emit('deck', players[playerName].deck);
        }
      } else {
        players.push({
          name: playerName,
          ready: false,
          id: socket.id,
          active: true,
        });

        io.sockets.emit('gameStatus', players);
      }
    });

    socket.on('playerRejoin', (playerName) => {

    });

    socket.on('playerReady', (playerName) => {
      console.log('Player ready: ', playerName);

      players.find(player => player.name === playerName).ready = true;

      io.sockets.emit('gameStatus', players);

      if (!players.find(player => !player.ready)) {
        shuffle(deck);

        io.sockets.emit('gameStart');

        players.forEach((player) => {
          console.log('send deck to player ', player.name);

          player.deck = getPlayerStartCards(deck);
          io.to(player.id).emit('deck', player.deck);
        });
      }
    });

    socket.on('playerReconnect', (playerName) => {
      console.log('Player reconnected: ', playerName);
    });

    socket.on('disconnect', () => {
      console.log('disconnected!');

      const disconnectedPlayer = players.find(player => player.id === socket.id);

      if (disconnectedPlayer) {
        disconnectedPlayer.active = false;
      }
    });
  });

  // setInterval(() => {
  //   io.sockets.emit('state', {});
  // }, 1000 / 60);
}
