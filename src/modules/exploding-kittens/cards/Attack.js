import sendPlayerUseCardOnPLayer from '../helpers/messages/sendPlayerUseCardOnPLayer';
import sendPlayerTurnMessage from '../helpers/messages/sendPlayerTurnMessage';
import gameUpdate from '../helpers/gameUpdate';
import sendPlayerBlockCard from '../helpers/messages/sendPlayerBlockCard';

export default {
  apply(bridge, room, card) {
    sendPlayerUseCardOnPLayer(bridge, room, card.props.name);

    room.nextPlayer();
    room.penaltyMoves += 2;

    sendPlayerTurnMessage(bridge, room);
    gameUpdate(bridge, room);
  },

  cancel(bridge, room, card) {
    sendPlayerBlockCard(bridge, room, card.props.name);

    room.previousPlayer();
    room.penaltyMoves -= 2;

    sendPlayerTurnMessage(bridge, room);
    gameUpdate(bridge, room);
  },
}
