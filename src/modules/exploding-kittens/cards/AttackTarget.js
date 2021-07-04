import sendPlayerUseCardOnPLayer from '../helpers/messages/sendPlayerUseCardOnPLayer';
import sendPlayerTurnMessage from '../helpers/messages/sendPlayerTurnMessage';
import gameUpdate from '../helpers/gameUpdate';
import sendPlayerBlockCard from '../helpers/messages/sendPlayerBlockCard';
import removeTargetFromPlayers from '../helpers/removeTargetFromPlayers';

export default {
  apply(bridge, room, card, options) {
    const attackedPlayer = room.getPlayer(options.name);

    sendPlayerUseCardOnPLayer(bridge, room, card.props.name);

    room.nextPlayer(attackedPlayer.name);
    room.penaltyMoves += 2;

    sendPlayerTurnMessage(bridge, room);

    gameUpdate(bridge, room);
  },

  cancel(bridge, room, card) {
    sendPlayerBlockCard(bridge, room, card.props.name);

    room.previousPlayer();
    room.penaltyMoves -= 2;

    removeTargetFromPlayers(room);
    sendPlayerTurnMessage(bridge, room);
    gameUpdate(bridge, room);
  }
}
