import sendPlayerUseCardOnPLayer from '../helpers/messages/sendPlayerUseCardOnPLayer';
import gameUpdate from '../helpers/gameUpdate';

export default {
  apply(bridge, room, card, player, options) {
    sendPlayerUseCardOnPLayer(bridge, room, card.props.name);

    const swapPlayer = room.getPlayer(options.name);
    const swapPlayerCards = swapPlayer.deck.cards;

    swapPlayer.deck.cards = player.deck.cards;
    player.deck.cards = swapPlayerCards;

    gameUpdate(bridge, room);
  }
}
