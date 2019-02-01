export default function getRoomsList(rooms, name) {
  return rooms
    .filter(room => room.status !== 'ended')
    .map((room) => {
      const reconnected = room.getPlayer(name);

      return Object.assign({}, room, { reconnected })
    });
}
