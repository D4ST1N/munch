export default function removeTargetFromPlayers(room, name) {
  if (name) {
    const player = room.getPlayer(name);
    player.targeted = false;

    return;
  }

  room.players.forEach((player) => {
    player.targeted = false;
  });
}
