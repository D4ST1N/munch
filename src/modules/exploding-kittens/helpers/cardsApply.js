import Attack from '../cards/Attack';
import Skip from '../cards/Skip';
import Nope from '../cards/Nope';
import Shuffle from '../cards/Shuffle';
import SeeTheFuture from '../cards/SeeTheFuture';
import ChangeTheFuture from '../cards/ChangeTheFuture';
import SwapTopAndBottom from '../cards/SwapTopAndBottom';
import Freedom from '../cards/Freedom';
import GetLower from '../cards/GetLower';
import Reverse from '../cards/Reverse';
import AttackTarget from '../cards/AttackTarget';
import CatomicBomb from '../cards/CatomicBomb';
import Swap from '../cards/Swap';
import GarbageCollector from '../cards/GarbageCollector';
import Favor from '../cards/Favor';
import BlindCombo from '../cards/combinations/BlindCombo';
import SightedCombo from '../cards/combinations/SightedCombo';
import TrashCombo from '../cards/combinations/TrashCombo';
import Trash from '../cards/Trash';

export default function cardsApply(bridge, cards, room, options) {
  const player = room.currentPlayer;
  console.log('Cards apply');

  if (cards.length === 1) {
    const [ card ] = cards;

    console.log(card);

    switch (card.props.name) {
      case 'shuffle':
        Shuffle.apply(bridge, room, card);

        break;

      case 'see-the-future':
        SeeTheFuture.apply(bridge, room, card, player);

        break;

      case 'see-the-future-x5':
        SeeTheFuture.apply(bridge, room, card, player, 5);

        break;

      case 'change-the-future':
        ChangeTheFuture.apply(bridge, room, card, player);

        break;

      case 'change-the-future-x5':
        ChangeTheFuture.apply(bridge, room, card, player, 5);

        break;

      case 'swap-top-and-bottom':
        SwapTopAndBottom.apply(bridge, room, card);

        break;

      case 'skip':
        Skip.apply(bridge, room, card);

        break;

      case 'freedom':
        Freedom.apply(bridge, room, card);

        break;

      case 'attack':
        Attack.apply(bridge, room, card);

        break;

      case 'nope':
        Nope.apply(bridge, room, card, options);

        break;

      case 'get-lower':
        GetLower.apply(bridge, room, card, player);

        break;

      case 'reverse':
        Reverse.apply(bridge, room, card);

        break;

      case 'attack-target':
        AttackTarget.apply(bridge, room, card, options);

        break;

      case 'catomic-bomb':
        CatomicBomb.apply(bridge, room, card);

        break;

      case 'swap':
        Swap.apply(bridge, room, card, player, options);

        break;

      case 'garbage-collector':
        GarbageCollector.apply(bridge, room, card, player);

        break;

      case 'favor':
        Favor.apply(bridge, room, card, player, options);

        break;

      case 'trash':
        Trash.apply(bridge, room, card, player);

        break;

      default:
        break;
    }
  } else if (cards.length === 2) {
    BlindCombo.apply(bridge, room, player, options);
  } else if (cards.length === 3) {
    SightedCombo.apply(bridge, room, player, options);
  } else if (cards.length === 5) {
    TrashCombo.apply(bridge, room, player);
  }
}
