import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';
import getCardsList from './getCardsList';

export default function playerConnect(bridge, name, room, socket) {
  console.log('player connect', name);

  const reconnected = room.playerConnect(bridge, name, socket.id);

  console.log('join room');

  bridge.broadcast(socket, 'newGameStarted');

  socket.join(room.id);

  if (room.gameStarted) {
    console.log('game started!');
    const player = room.getPlayer(name);
    const watcher = room.getWatcher(name);
    const currentPlayer = room.currentPlayer;
    const userName = reconnected ? name : false;
    const watcherName = player ? false : watcher.name;

    bridge.emit(socket.id, 'gameStart', { players: room.players });

    console.log(player);
    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_TURN',
      who: currentPlayer.name,
      playerId: player ? player.id : watcher.id,
    });

    gameUpdate(bridge, room, userName, watcherName);
    bridge.emit(room.id, 'updateMove', { cards: room.move ? room.move.partsCards : [] });
  } else {
    bridge.emit(
      room.id,
      'gameStatus',
      {
        players: room.players,
        cards: getCardsList(room),
        settings: room.settings,
      }
    );
  }
}
