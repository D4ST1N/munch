export default function getRoomsList(rooms, name) {
  return rooms
    .filter(room => room.status !== 'ended')
    .map((room) => {
      const reconnected = room.getPlayer(name);
      const gameStarted = room.gameStarted;
      const canJoin = (reconnected && gameStarted) || !gameStarted;

      return Object.assign({}, room, { canJoin, reconnected })
    });
}
