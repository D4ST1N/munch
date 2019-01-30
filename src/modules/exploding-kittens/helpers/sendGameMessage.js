export default function sendGameMessage(bridge, text, room, name, options = {}, playerId = false) {
  console.log('send message to', room.id);

  const message = {
    text: text,
    options: {
      player: name || room.currentPlayer.name,
      ...options,
    },
  };

  bridge.emit(playerId ? playerId : room.id, 'gameMessage', message);
}
