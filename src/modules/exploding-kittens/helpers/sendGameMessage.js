export default function sendGameMessage(bridge, room, payload) {
  console.log('send message to', room.id);
  console.log(room.move);

  const who = payload.who
    || (room.move && room.move.lastPart ? room.move.lastPart.who : room.currentPlayer.name);
  const whom = payload.whom
    || (room.move && room.move.lastPart ? room.move.lastPart.whom : room.next.name);
  console.log(who, payload.who, room.move, room.currentPlayer);
  console.log(whom);

  const message = {
    key: payload.key,
    options: {
      who,
      whom,
      ...payload.options,
    },
  };

  bridge.emit(payload.playerId ? payload.playerId : room.id, 'gameMessage', message);
}
