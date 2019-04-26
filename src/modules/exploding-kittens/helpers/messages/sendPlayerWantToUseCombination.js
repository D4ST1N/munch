import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCombination(bridge, room, count) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_COMBINATION',
    options: {
      count,
    },
  });
}
