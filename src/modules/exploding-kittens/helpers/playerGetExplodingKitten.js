import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';

export default function playerGetExplodingKitten(bridge, room, player, card) {
  console.log('player get exploding kitten');

  if (player.deck.isCardExist('cat-box')
    && player.deck.getCardCount('exploding-kitten') === 1
  ) {
    console.log('player has cat box');

    return true;
  }

  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_GET_EXPLODING_KITTEN', room, player.name);

  if (player.deck.isCardExist('defuse')) {
    console.log('player has defuse');
    const explodingKittenCard = player.deck.useCardByType('exploding-kitten');

    room.trash.addCard(...player.deck.useCardByType('defuse'), false);
    room.deck.addCard(...explodingKittenCard);

    sendGameMessage(
      bridge,
      'NOTIFICATIONS.GAME.PLAYER_DEFUSE_EXPLODING_KITTEN',
      room,
      player.name,
    );
    room.logs.push({
      text: 'LOGS.PLAYER_DEFUSE_EXPLODING_KITTEN',
      options: {
        player: player.name,
      }
    });

    return true;
  }

  player.exploded = true;

  sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_EXPLODED', room, player.name);
  bridge.emit(player.id, 'endGame', { win: false });
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
