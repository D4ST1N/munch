import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCard(bridge, room, name) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_CARD',
    options: {
      component: {
        name,
      },
    },
  });
}
