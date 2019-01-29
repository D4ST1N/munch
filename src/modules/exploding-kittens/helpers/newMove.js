import Move from '../entities/Move';

export default function newMove(bridge, room, player) {
  room.history.newMove(new Move({
    who: player,

    onTimer(cards, time, moveOptions) {
      console.log('on timer');
      bridge.emit(room.id, 'startTimer', time);
      room.players.forEach((player) => {
        if (player.name === this.who.name) {
          return;
        }

        const playerHasStop = player.deck.hasCardOfType('nope');
        console.log('send start timer to', player.name);

        const text = 'NOTIFICATIONS.GAME.TIME_TO_STOP';
        let title;
        let options = {
          player: this.who.name,
        };

        switch (cards.length) {
          case 1:
            title = 'NOTIFICATIONS.GAME.PLAYER_USE_CARD';
            options.card = cards[0].props.name;
            break;
          case 2:
            title = 'NOTIFICATIONS.GAME.PLAYER_USE_TWO_CARDS_COMBO';
            options.whom = moveOptions.name;
            break;
          case 3:
            title = 'NOTIFICATIONS.GAME.PLAYER_USE_THREE_CARDS_COMBO';
            options.whom = moveOptions.name;
            options.card = moveOptions.card.props.name;
            break;
          case 5:
            title = 'NOTIFICATIONS.GAME.PLAYER_USE_FIVE_CARDS_COMBO';
            break;
          default:
            break;
        }

        bridge.emit(player.id, 'startActionTimer', {
          title,
          text,
          cards,
          time,
          options,
          actionEnabled: playerHasStop,
        });
      });
    },
  }));
}
