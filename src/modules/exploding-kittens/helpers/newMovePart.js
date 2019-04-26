import cardsApply from './cardsApply';
import beforeActionMessage from './beforeActionMessage';
import gameUpdate from './gameUpdate';

export default function newMovePart(bridge, { room, who, cards, options }) {
  room.move.newPart({
    cards,
    who,
    options,
    whom: options.name || room.next.name,
    started: () => {
      beforeActionMessage(bridge, room, cards, options);
      console.log('update');
      gameUpdate(bridge, room);

    },
    complete: () => {
      console.log('complete');
      console.log(cards, options);
      cardsApply(bridge, cards, room, options);
    },
    failure: () => {
      console.error('failed card applying');
      bridge.emit(room.id, 'timerStopped');
    },
  });
}
