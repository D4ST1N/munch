import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCombinationOnPlayerWithCard(
  bridge,
  room,
  count,
  whom,
  cardName,
) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_COMBINATION_ON_PLAYER_WITH_CARD',
    options: {
      whom,
      count,
      component: {
        name: cardName,
      },
    },
  });
}
