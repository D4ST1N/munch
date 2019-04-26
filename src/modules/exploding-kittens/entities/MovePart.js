import Deck from './Deck';
import DelayedAction from './DelayedAction';
import settings from '../../../settings';
import getActionTime from '../helpers/getActionTime';

export default class MovePart {
  constructor({ who, whom, cards, started, complete, failure }) {
    this.who = who;
    this.whom = whom;
    this.deck = new Deck(cards);
    this.complete = complete;
    this.failure = failure;
    this.started = started;
    this.actionComplete = false;
    this.applyCards();
  }

  applyCards() {
    const time = getActionTime(this.deck.cards);

    this.delayedAction = new DelayedAction(
      this.onActionStarted.bind(this),
      this.onActionComplete.bind(this),
      this.onActionStopped.bind(this),
      time
    );
  }

  onActionStarted() {
    console.log('action started');

    this.started();
  }

  onActionComplete() {
    console.log('action complete');
    this.actionComplete = true;

    this.complete()
  }

  onActionStopped() {
    console.error('action stopped');

    this.failure();
  }
}
