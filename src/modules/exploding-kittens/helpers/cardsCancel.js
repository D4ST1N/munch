import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';
import cardsApply      from './cardsApply';

export default function cardsCancel(bridge, cards, room, socket, options) {
  if (cards.length === 1) {
    const [ card ] = cards;

    console.log(card);

    switch (card.props.type) {
      case 'skip':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_SKIP', room);

        room.previousPlayer();

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        room.logs.push({
          text: `Хід граця ${room.currentPlayer.name}`,
        });
        gameUpdate(bridge, room);

        break;

      case 'attack':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_ATTACK', room);

        room.previousPlayer();
        room.penaltyMoves -= 2;

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        room.logs.push({
          text: `Хід граця ${room.currentPlayer.name}`,
        });
        gameUpdate(bridge, room);

        break;

      case 'nope':
        const applyingPart = room.history.current.parts[room.history.current.parts.length - 3];
        cardsApply(bridge, applyingPart.cards, room, socket, options);

        break;

      default:
        break;
    }
  }
}
