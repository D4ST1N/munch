import Deck      from './Deck';
import MoveTimer from './MoveTimer';

export default class MoveBackup {
  constructor({ who, whom, onTimer }) {
    this.who = who;
    this.whom = whom;
    this.onTimer = onTimer;
    this.status = 'started';
    this.parts = [];
    this.timer = null;
  }

  actionCards = [
    'see-the-future',
    'see-the-future-x5',
    'shuffle',
    'change-the-future',
    'change-the-future-x5',
    'swap-top-and-bottom',
    'swap',
    'garbage-collector',
  ];

  get cards() {
    return this.parts[this.parts.length - 1].deck.cards;
  }

  get allCards() {
    return this.parts.reduce((cards, part) => {
      cards.push(...part.deck.cards);
      return cards;
    }, []);
  }

  endMove() {
    this.status = 'ended';
  }

  addCards(cards, options) {
    this.parts.push({
      options,
      deck: new Deck(cards)
    });
    console.log('add cards');

    return this.applyCards(cards, options);
  }

  applyCards(cards, options) {
    console.log(options);
    return new Promise(
      (resolve, reject) => {
        let time;

        if (cards.length === 1) {
          const [card] = cards;

          if (this.actionCards.includes(card.props.name)) {
            time = 5000;
          } else {
            time = 0;
          }
        } else {
          time = 10000;
        }

        this.onTimer(cards, time, options);
        this.timer = new MoveTimer({
          time,

          action() {
            console.log('success');
            resolve(cards);
          },

          cancel() {
            console.log('cancel');
            reject(cards);
          },
        });
      }
    );
  }
}
