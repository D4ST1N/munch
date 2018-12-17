import socketIO from 'socket.io';
import config   from '../../configs/exploding-kittens';
import addCards from './addCards';
import shuffle  from '../../utils/shuffle';
import getCards from './getCards';

export default function init(server) {
  const io = socketIO(server);

  const deck = [];
  const players = [];

  config.cards.forEach((cardConfig) => {
    addCards(deck, cardConfig);
  });

  io.on('connection', (socket) => {
    io.sockets.emit('deck', shuffle(deck));
    io.sockets.emit('deck', getCards(deck, 5, ['Вибухове кошеня', 'Знешкодь']));

    socket.on('playerConnect', (playerName) => {
      console.log('Player connected: ', playerName);
    });

    socket.on('playerReconnect', (playerName) => {
      console.log('Player reconnected: ', playerName);
    });

    socket.on('disconnect', () => {
      console.log('disconnected!');
    });
  });

  // setInterval(() => {
  //   io.sockets.emit('state', {});
  // }, 1000 / 60);
}
