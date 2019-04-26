import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import gameUpdate from '../helpers/gameUpdate';

export default {
  apply(bridge, room, card, player) {
    sendPlayerUseCard(bridge, room, card.props.name);

    room.players.forEach((somePlayer) => {
      if (somePlayer.name === player.name) return;

      const usedCard = somePlayer.deck.useRandomCard();
      room.trash.addCard(...usedCard);
      somePlayer.emit('looseCard', ...usedCard);
    });

    gameUpdate(bridge, room);
  }
}
