import sendGameMessage from '../sendGameMessage';

export default function sendPlayerTurnMessage(bridge, room, who = room.currentPlayer.name) {
  sendGameMessage(bridge, room, {
    who,
    key: 'GAME.LOGS.PLAYER_TURN',
  });
}
