import isNopeCard from './hasNopeCard';
import newMove    from './newMove';
import gameUpdate from './gameUpdate';
import cardsApply from './cardsApply';

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

  console.log('new move');

  if (!room.history.current) {
    newMove(bridge, room, player);
  }

  const move = room.history.current;

  // TODO check for cheats
  cards.forEach(card => player.deck.useCard(card.id));
  gameUpdate(bridge, room, player.name);
  room.logs.push({
    text: 'LOGS.PLAYER_MAKE_MOVE',
    options: {
      player: name,
    },
    deck: [...cards],
  });

  room.history.newMove(move);

  move.addCards(cards, { playerName: name, ...options }).then(() => {
    console.log(isNopeCard(cards), move.timer);
    if (isNopeCard(cards) && move.timer) {
      move.timer.stopTimer();
      bridge.emit(room.id, 'stopTimer');
    }

    cardsApply(bridge, cards, room, socket, options);
  }).catch(console.error);

  bridge.emit(room.id, 'updateMove', { cards: move.allCards });
}
