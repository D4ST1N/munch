import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import gameUpdate from '../helpers/gameUpdate';

export default {
  apply(bridge, room, card, player, count = 3) {
    sendPlayerUseCard(bridge, room, card.props.name);
    gameUpdate(bridge, room);

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
  }
}
