import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';

export default function playerGetImplodingKitten(bridge, room, player, card) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_GET_CARD',
    options: {
      component: {
        name: card.props.name,
      },
    },
  });

  if (!room.implodingKittenFound) {
    room.deck.addCard(card);
    room.implodingKittenFound = true;

    return true;
  }

  player.exploded = true;

  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_EXPLODE',
  });
  bridge.emit(player.id, 'endGame', { win: false });
  room.trash.addCard(card, false);
  room.killPlayer();

  gameUpdate(bridge, room);

  if (room.gameEnded) {
    const winner = room.players[0];

    bridge.emit(winner.id, 'endGame', { win: true });

    room.gameEnd();
  }

  return false;
}
