import playerMove from './playerMove';

export default function stopAction(bridge, socket, { room, name }) {
  console.log('stop action');
  const player = room.getPlayer(name);

  if (!player) {
    return;
  }

  const move = room.history.current;
  move.timer.stopTimer();

  const usedCard = player.deck.useCardByName('nope');
  console.log(usedCard);

  playerMove(bridge, socket, {
    room,
    name,
    cards: usedCard,
  });
}
