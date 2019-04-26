import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import delayedGameUpdate from '../helpers/delayedGameUpdate';

export default {
  apply(bridge, room, card) {
    sendPlayerUseCard(bridge, room, card.props.name);

    const cards = room.deck.cards;
    const last = cards.length - 1;
    [ cards[0], cards[last] ] = [ cards[last], cards[0] ];

    delayedGameUpdate(bridge, room);
  },

  cancel(bridge, room, card) {

  },
}
