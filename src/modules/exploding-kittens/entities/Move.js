import Deck      from './Deck';
import MoveTimer from './MoveTimer';

export default class Move {
  constructor({ who, whom, onTimer }) {
    this.who = who;
    this.whom = whom;
    this.onTimer = onTimer;
    this.status = 'started';
    this.deck = new Deck();
    this.timer = null;
  }

  actionCards = [
    'see-the-future',
    'shuffle',
  ];

  get cards() {
    return this.deck.cards;
  }

  endMove() {
    this.status = 'ended';
  }

  addCards(cards) {
    cards.forEach((card) => this.deck.addCard(card));
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
                  resolve(card);
                },

                cancel() {
                  reject(card);
                },
              });
            } else {
              resolve(card);
            }

            break;

          default:
            break;
        }
      }
    );
  }

  useCard(card) {
    console.log(card);

    switch (card.props.type) {
      case 'shuffle':
        // TODO check for cheats
        room.trash.push(...player.deck.useCard(card.id));

        room.deck.shuffle();

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE', roomId, name);
        gameUpdate(roomId);

        break;

      case 'see-the-future':
        // TODO check for cheats
        room.trash.push(...player.deck.useCard(card.id));

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', roomId, name);
        gameUpdate(roomId);

        io.to(player.id).emit('seeTheFuture', room.deck.cards.slice(-3));

        break;

      case 'skip':
        // TODO check for cheats
        room.trash.push(...player.deck.useCard(card.id));

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_SKIP', roomId, name);

        if (!room.playerEndMove()) {
          room.nextPlayer();
        }

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_TURN', roomId);
        gameUpdate(roomId);

        break;

      case 'favor':
        // TODO check for cheats
        room.trash.push(...player.deck.useCard(card.id));

        const favorPlayer = room.nextPlayer(true);

        sendGameMessage('NOTIFICATIONS.GAME.PLAYER_USE_FAVOR', roomId, name, {
          whom: favorPlayer.name,
        });
        gameUpdate(roomId);

        console.log('send favor event to', favorPlayer.name);
        io.to(favorPlayer.id).emit('playerUseFavor');

        socket.on('playerSelectFavorCard', (cardId) => {
          console.log('favor player choose card', cardId);
          player.deck.addCard(...favorPlayer.deck.useCard(cardId));

          gameUpdate(roomId);
        });

        break;

      default:
        break;
    }
  }

  useCardCombination(cards) {

  }
}
