export default function sendGameMessage(bridge, text, room, name, options = {}) {
  console.log('send message to', room.id);

  const message = {
    text: text,
    options: {
      player: name || room.currentPlayer.name,
      ...options,
    },
  };

  bridge.emit(room.id, 'gameMessage', message);
}
