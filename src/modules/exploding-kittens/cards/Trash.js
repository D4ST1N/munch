import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import gameUpdate from '../helpers/gameUpdate';

export default {
  apply(bridge, room, card, player) {
    sendPlayerUseCard(bridge, room, card.props.name);

    const usedCard = room.trash.useRandomCard();

    player.deck.addCard(...usedCard);
    player.emit('getCard', ...usedCard);

    gameUpdate(bridge, room);
  }
}
