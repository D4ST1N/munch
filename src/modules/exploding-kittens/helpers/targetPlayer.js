export default function targetPlayer(room, name) {
  const player = room.getPlayer(name);
  player.targeted = true;
}
