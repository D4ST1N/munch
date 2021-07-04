import sendGameMessage from '../sendGameMessage';

export default function sendPlayerUseCombination(bridge, room, count) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_USE_COMBINATION',
    options: {
      count,
    },
  });
}
