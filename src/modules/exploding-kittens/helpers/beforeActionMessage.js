import getActionTime from './getActionTime';
import sendPlayerWantToUseCardOnPLayer from './messages/sendPlayerWantToUseCardOnPLayer';
import sendPlayerWantToUseCard from './messages/sendPlayerWantToUseCard';
import sendPlayerWantToUseCombinationOnPlayer
  from './messages/sendPlayerWantToUseCombinationOnPlayer';
import sendPlayerWantToUseCombination from './messages/sendPlayerWantToUseCombination';
import targetPlayer from './targetPlayer';

export default function beforeActionMessage(bridge, room, cards, options) {
  console.log(options);
  const time = getActionTime(cards);
  console.log(time);

  if (options.name) {
    targetPlayer(room, options.name);
  }

  if (time === 0) {
    return;
  }

  bridge.emit(room.id, 'timerStarted', { time });

  if (cards.length === 1) {
    const [card] = cards;

    if (options.name) {
      sendPlayerWantToUseCardOnPLayer(bridge, room, card.props.name, options.name);
    } else {
      sendPlayerWantToUseCard(bridge, room, card.props.name);
    }
  } else {
    if (options.name) {
      sendPlayerWantToUseCombinationOnPlayer(bridge, room, cards.length, options.name);
    } else {
      sendPlayerWantToUseCombination(bridge, room, cards.length);
    }
  }
}
