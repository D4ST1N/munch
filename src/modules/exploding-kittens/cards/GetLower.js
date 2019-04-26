import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import playerGetCard from '../helpers/playerGetCard';

export default {
  apply(bridge, room, card, player) {
    sendPlayerUseCard(bridge, room, card.props.name);
    playerGetCard(bridge, room, player.name, false);
  }
}
