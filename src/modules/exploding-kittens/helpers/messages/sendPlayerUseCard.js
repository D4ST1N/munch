import sendGameMessage from '../sendGameMessage';

export default function sendPlayerUseCard(bridge, room, name) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_USE_CARD',
    options: {
      component: {
        name,
      },
    },
  });
}
