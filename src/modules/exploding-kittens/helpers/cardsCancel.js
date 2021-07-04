import Attack from '../cards/Attack';
import Skip from '../cards/Skip';
import Nope from '../cards/Nope';
import Freedom from '../cards/Freedom';
import Reverse from '../cards/Reverse';
import AttackTarget from '../cards/AttackTarget';
import Favor from '../cards/Favor';

export default function cardsCancel(bridge, cards, room, options) {
  console.log(arguments);
  if (cards.length === 1) {
    const [ card ] = cards;

    console.log(card);

    switch (card.props.name) {
      case 'skip':
        Skip.cancel(bridge, room, card);

        break;

      case 'attack':
        Attack.cancel(bridge, room, card);

        break;

      case 'favor': {
        Favor.cancel(bridge, room, card);

        break;
      }

      case 'freedom': {
        Freedom.cancel(bridge, room, card);

        break;
      }

      case 'nope':
        Nope.cancel(bridge, room, card, options);

        break;

      case 'reverse':
        Reverse.cancel(bridge, room, card);

        break;

      case 'attack-target':
        AttackTarget.cancel(bridge, room, card);

        break;

      default:
        break;
    }
  }
}
