import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';
import cardsApply      from './cardsApply';

export default function cardsCancel(bridge, cards, room, socket, options) {
  console.log(arguments);
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

      case 'favor': {
        const move = room.history.current;
        const applyingPart = move.parts[move.parts.length - 2];
        const mergedOptions = Object.assign({}, options, applyingPart.options);
        const player = room.getPlayer(mergedOptions.name);

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_ATTACK', room);

        bridge.emit(player.id, 'playerEndFavor');
        gameUpdate(bridge, room);

        break;
      }

      case 'freedom': {
        room.previousPlayer();
        room.penaltyMoves = room.penaltyBackup;

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_FREEDOM', room);
        gameUpdate(bridge, room);

        break;
      }

      case 'nope':
        const move = room.history.current;

        move.parts.splice(-2).forEach(part => room.trash.addCard(...part.deck.cards));

        gameUpdate(bridge, room);
        bridge.emit(room.id, 'updateMove', { cards: move.allCards });

        const applyingPart = move.parts[move.parts.length - 1];
        const mergedOptions = Object.assign({}, options, applyingPart.options);
        const applyingCards = applyingPart.deck.cards;

        move.applyCards(applyingCards, mergedOptions)
            .then(() => {
              cardsApply(bridge, applyingCards, room, socket, mergedOptions);
            }).catch(console.error);

        break;

      case 'reverse':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_REVERSE', room);

        room.reverse();
        room.previousPlayer();

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        gameUpdate(bridge, room);

        break;

      case 'attack-target':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_BLOCK_ATTACK_TARGET', room);

        room.previousPlayer();
        room.penaltyMoves -= 2;

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        gameUpdate(bridge, room);

        break;

      default:
        break;
    }
  }
}
