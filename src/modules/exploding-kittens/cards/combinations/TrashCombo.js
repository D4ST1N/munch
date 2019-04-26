import sendPlayerUseCombination from '../../helpers/messages/sendPlayerUseCombination';
import gameUpdate from '../../helpers/gameUpdate';

export default {
  apply(bridge, room, player) {
    sendPlayerUseCombination(bridge, room, 5);
    console.log('select from trash');
    bridge.emit(player.id, 'showCardList', {
      deck: room.trash.cards,
      event: 'selectTrashCard',
    });

    const onSelectTrashCard = (socket, { card }) => {
      const usedCard = room.trash.useCard(card.id);
      player.deck.addCard(...usedCard);
      player.emit('getCard', ...usedCard);
      gameUpdate(bridge, room);
      bridge.off('selectTrashCard', onSelectTrashCard);
    };

    bridge.on('selectTrashCard', onSelectTrashCard);
  }
}
