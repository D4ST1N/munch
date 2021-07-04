import Move from '../entities/Move';
import isNopeCard from './hasNopeCard';
import gameUpdate from './gameUpdate';
import newMovePart from './newMovePart';

export default function playerMove(bridge, socket, { room, name, cards, options }) {
  console.log('player move');
  const player = room.getPlayer(name);

  if (!player) {
    return;
  }

  const currentPlayer = room.currentPlayer;

  if (player.name !== currentPlayer.name && !isNopeCard(cards)) {
    return;
  }

  if (!room.move) {
    console.log('new move');
    room.move = new Move();
  }

  cards.forEach(card => player.deck.useCard(card.id));
  gameUpdate(bridge, room, player.name);

  if (isNopeCard(cards)) {
    room.move.lastPart.delayedAction.stopTimer();
    // move.timer.stopTimer();
    bridge.emit(room.id, 'stopTimer');
  }

  newMovePart(bridge, {
    room,
    cards,
    options,
    who: player.name,
  });
  console.log('updateMove');

  bridge.emit(room.id, 'updateMove', { cards: room.move.partsCards });
}
