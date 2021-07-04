import sendGameMessage from '../sendGameMessage';

export default function sendPlayerBlockCard(bridge, room, name) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_BLOCK_CARD',
    options: {
      component: {
        name,
      },
    },
  });
}
