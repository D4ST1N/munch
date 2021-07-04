import sendGameMessage from '../sendGameMessage';

export default function sendPlayerGiveCard(bridge, room, who) {
  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_GIVE_CARD',
    options: {
      who,
    }
  });
}
