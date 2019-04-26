import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import delayedGameUpdate from '../helpers/delayedGameUpdate';

export default {
  apply(bridge, room, card, player, count = 3) {
    sendPlayerUseCard(bridge, room, card.props.name);
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

      delayedGameUpdate(bridge, room);

      bridge.off('submitNewFuture', onSubmitNewFuture);
    };

    bridge.on('submitNewFuture', onSubmitNewFuture);
  }
}
