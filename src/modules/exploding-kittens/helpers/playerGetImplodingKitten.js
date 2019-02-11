import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';

export default function playerGetImplodingKitten(bridge, room, player, card) {
  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_GET_IMPLODING_KITTEN', room, player.name);

  if (!room.implodingKittenFound) {
    room.deck.addCard(card);
    room.implodingKittenFound = true;

    return true;
  }

  player.exploded = true;

  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_EXPLODED', room, player.name);
  bridge.emit(player.id, 'endGame', { win: false });
  room.trash.addCard(card, false);
  room.killPlayer();
  room.logs.push({
    text: 'LOGS.PLAYER_EXPLODED',
    options: {
      player: player.name,
    },
  });

  gameUpdate(bridge, room);

  if (room.gameEnded) {
    const winner = room.players[0];

    sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_WIN', room, winner.name);
    bridge.emit(winner.id, 'endGame', { win: true });

    room.gameEnd();
    room.logs.push({
      text: 'LOGS.PLAYER_WIN',
      options: {
        player: player.name,
      },
    });
  }

  return false;
}
