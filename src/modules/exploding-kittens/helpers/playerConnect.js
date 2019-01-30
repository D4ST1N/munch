import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';

export default function playerConnect(bridge, name, room, socket) {
  console.log('player connect', name);

  const reconnected = room.playerConnect(name, socket.id);

  console.log('join room');

  bridge.broadcast(socket, 'newGameStarted');

  socket.join(room.id);

  if (room.gameStarted) {
    console.log('game started!');
    console.log(room);
    const move = room.history.current;
    const player = room.getPlayer(name);

    bridge.emit(socket.id, 'gameStart');

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room, name, {}, player.id);
    gameUpdate(bridge, room, reconnected ? name : false);
    bridge.emit(room.id, 'updateMove', { cards: move.allCards });
  } else {
    bridge.emit(room.id, 'gameStatus', room.players);
  }
}
