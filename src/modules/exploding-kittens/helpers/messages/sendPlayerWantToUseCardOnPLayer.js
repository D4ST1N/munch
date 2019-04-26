import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCardOnPLayer(bridge, room, name, whom) {
  sendGameMessage(bridge, room, {
    whom,
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_CARD_ON_PLAYER',
    options: {
      component: {
        name,
      },
    },
  });
}
