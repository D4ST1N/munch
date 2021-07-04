import sendGameMessage from '../sendGameMessage';

export default function sendPlayerWantToUseCombinationOnPlayer(bridge, room, count, whom) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_WANT_TO_USE_COMBINATION_ON_PLAYER',
    options: {
      whom,
      count,
    },
  });
}
