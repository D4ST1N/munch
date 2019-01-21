import Deck      from './Deck';
import MoveTimer from './MoveTimer';

export default class Move {
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
    'shuffle',
  ];

  get cards() {
    return this.parts[this.parts.length - 1].cards;
  }

  get allCards() {
    console.log(this.parts);
    return this.parts.reduce((cards, part) => {
      cards.push(...part.cards);
      return cards;
    }, []);
  }

  endMove() {
    this.status = 'ended';
  }

  addCards(cards) {
    this.parts.push(new Deck(cards));
    console.log('add cards');

    return new Promise(
      (resolve, reject) => {
        switch (cards.length) {
          case 1:
            const [card] = cards;

            if (this.actionCards.includes(card.props.type)) {
              console.log('start');

              this.onTimer(card);
              this.timer = new MoveTimer({
                time: 5000,

                action() {
                  console.log('success');
                  resolve(cards);
                },

                cancel() {
                  reject(cards);
                },
              });
            } else {
              resolve(cards);
            }

            break;

          default:
            break;
        }
      }
    );
  }
}
