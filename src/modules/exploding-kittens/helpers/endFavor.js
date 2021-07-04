export default function endFavor(room) {
  room.players.forEach((player) => {
    player.selected = false;
  });
}
