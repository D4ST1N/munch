import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCombinationWithCard(bridge, room, count, cardName) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_COMBINATION_WITH_CARD',
    options: {
      count,
      component: {
        name: cardName,
      },
    },
  });
}
