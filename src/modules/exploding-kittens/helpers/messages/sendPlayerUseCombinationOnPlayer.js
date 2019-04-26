import sendGameMessage from '../sendGameMessage';

export default function sendPlayerUseCombinationOnPlayer(bridge, room, count, whom) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_USE_COMBINATION_ON_PLAYER',
    options: {
      whom,
      count,
    },
  });
}
