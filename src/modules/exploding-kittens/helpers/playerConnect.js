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
    const move = room.history.current;
    const player = room.getPlayer(name);
    const watcher = room.getWatcher(name);
    const currentPlayer = room.currentPlayer;
    const userName = reconnected ? name : false;
    const watcherName = player ? false : watcher.name;

    bridge.emit(socket.id, 'gameStart', { players: room.players });

    sendGameMessage(
      bridge,
      'NOTIFICATIONS.GAME.PLAYER_TURN',
      room,
      currentPlayer.name,
      {},
      player ? player.id : watcher.id,
    );

    gameUpdate(bridge, room, userName, watcherName);
    bridge.emit(room.id, 'updateMove', { cards: move ? move.allCards : [] });
    room.logs.push({
      text: 'LOGS.PLAYER_RECONNECT',
      options: {
        player: name,
      },
    });
  } else {
    bridge.emit(
      room.id,
      'gameStatus',
      {
        players: room.players,
        watchers: room.watchers,
        cards: getCardsList(room),
      }
    );
    room.logs.push({
      text: 'LOGS.PLAYER_CONNECT',
      options: {
        player: name,
      },
    });
  }
}
