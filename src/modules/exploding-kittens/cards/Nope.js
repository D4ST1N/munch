import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import gameUpdate from '../helpers/gameUpdate';
import sendPlayerBlockCard from '../helpers/messages/sendPlayerBlockCard';
import cardsCancel from '../helpers/cardsCancel';
import newMovePart from '../helpers/newMovePart';

export default {
  apply(bridge, room, card, options) {
    sendPlayerUseCard(bridge, room, card.props.name);

    const roomParts = room.move.parts;
    const previousPart = roomParts[roomParts.length - 2];

    if (previousPart) {
      cardsCancel(bridge, previousPart.deck.cards, room, options);
    }
  },

  cancel(bridge, room, card, options) {
    sendPlayerBlockCard(bridge, room, card.props.name);
    const move = room.move;

    move.parts.splice(-2).forEach(part => room.trash.addCard(...part.deck.cards));

    gameUpdate(bridge, room);
    bridge.emit(room.id, 'updateMove', { cards: room.move.partsCards });

    const applyingPart = move.parts[move.parts.length - 1];
    const mergedOptions = Object.assign({}, options, applyingPart.options);
    const applyingCards = [...applyingPart.deck.cards];
    move.parts.pop();

    console.log(mergedOptions);

    newMovePart(bridge, {
      room,
      who: applyingPart.who,
      cards: applyingCards,
      options: mergedOptions,
    });

    bridge.emit(room.id, 'updateMove', { cards: room.move.partsCards });
  },
}
