import sendGameMessage from '../sendGameMessage';
import gameUpdate      from '../gameUpdate';

export default function seeTheFuture(bridge, room, player, count = 3) {
  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', room);
  gameUpdate(bridge, room);

  // bridge.emit(player.id, 'seeTheFuture', room.deck.cards.slice(-count));
  bridge.emit(player.id, 'showCardList', {
    deck: room.deck.cards.slice(-count).reverse(),
    event: 'endSeeTheFuture',
    options: {
      changeCardOrder: false,
      submitAvailable: true,
      numbered: true,
    },
  });
  bridge.on('endSeeTheFuture', (socket, { room }) => {
    gameUpdate(bridge, room);
    bridge.off('endSeeTheFuture');
  });
  room.logs.push({
    text: 'LOGS.PLAYER_SEE_THE_FUTURE',
    options: {
      player: room.currentPlayer.name,
    },
    deck: [...room.deck.cards.slice(-count)],
  });
}
