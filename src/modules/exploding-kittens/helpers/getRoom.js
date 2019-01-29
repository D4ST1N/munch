export default function getRoom(rooms, roomId) {
  const room = rooms.find(room => room.id === roomId);

  if (!room || room.status === 'ended') {
    return false;
  }

  return room;
}
