import sendGameMessage from './sendGameMessage';

export default function playerGetExplodingKitten(bridge, room, player, card) {
  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_GET_EXPLODING_KITTEN', room.id, player.name);

  if (player.deck.isCardExist('defuse')) {
    console.log('player has defuse');

    room.trash.addCard(...player.deck.useCardByType('defuse'), false);
    room.deck.addCard(card);

    sendGameMessage(
      bridge,
      'NOTIFICATIONS.GAME.PLAYER_DEFUSE_EXPLODING_KITTEN',
      room,
      player.name,
    );
  } else {
    console.log('player exploded');

    player.exploded = true;

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_EXPLODED', room, player.name);
    bridge.emit(player.id, 'endGame', { win: false });
    room.trash.addCard(...player.deck.cards, false);
    room.trash.addCard(card, false);
    player.deck.clear();
    room.killCurrent();

    if (room.gameEnded) {
      const winner = room.players[0];

      sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_WIN', room, winner.name);
      bridge.emit(winner.id, 'endGame', { win: true });

      room.gameEnd();
    }
  }
}