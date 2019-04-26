import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import delayedGameUpdate from '../helpers/delayedGameUpdate';

export default {
  apply(bridge, room, card) {
    sendPlayerUseCard(bridge, room, card.props.name);

    room.deck.shuffle();

    delayedGameUpdate(bridge, room);
  },
}
