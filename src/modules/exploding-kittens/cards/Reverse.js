import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import sendPlayerTurnMessage from '../helpers/messages/sendPlayerTurnMessage';
import gameUpdate from '../helpers/gameUpdate';
import sendPlayerBlockCard from '../helpers/messages/sendPlayerBlockCard';

export default {
  apply(bridge, room, card) {
    sendPlayerUseCard(bridge, room, card.props.name);
    room.reverse();

    if (!room.playerEndMove()) {
      room.nextPlayer();
    }

    sendPlayerTurnMessage(bridge, room);
    gameUpdate(bridge, room);
  },

  cancel(bridge, room, card) {
    sendPlayerBlockCard(bridge, room, card.props.name);

    room.reverse();
    room.previousPlayer();

    sendPlayerTurnMessage(bridge, room);
    gameUpdate(bridge, room);
  }
}
