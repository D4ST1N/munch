import gameUpdate      from '../gameUpdate';
import sendGameMessage from '../sendGameMessage';

export default function changeTheFuture(bridge, room, player, count = 3) {
  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CHANGE_THE_FUTURE', room);
  bridge.emit(player.id, 'showCardList', {
    deck: room.deck.cards.slice(-count).reverse(),
    event: 'submitNewFuture',
    options: {
      changeCardOrder: true,
      numbered: true,
      submitAvailable: true,
    },
  });

  const onSubmitNewFuture = (socket, { room, cards }) => {
    room.deck.cards.splice(-count, count, ...(cards.reverse()));

    gameUpdate(bridge, room);
    setTimeout(() => {
      gameUpdate(bridge, room);
    }, 150);

    bridge.off('submitNewFuture', onSubmitNewFuture);
  };

  bridge.on('submitNewFuture', onSubmitNewFuture);
}
