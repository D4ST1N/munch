import sendGameMessage from '../sendGameMessage';

export default function sendPlayerUseCardOnPLayer(bridge, room, name, whom) {
  sendGameMessage(bridge, room, {
    whom,
    key: 'GAME.LOGS.PLAYER_USE_CARD_ON_PLAYER',
    options: {
      component: {
        name,
      },
    },
  });
}
