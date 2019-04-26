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

  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_GET_CARD',
    options: {
      component: {
        name: card.props.name,
      },
    },
  });

  if (player.deck.isCardExist('defuse')) {
    console.log('player has defuse');
    const explodingKittenCard = player.deck.useCardByName('exploding-kitten');

    room.trash.addCard(...player.deck.useCardByName('defuse'), false);
    room.deck.addCard(...explodingKittenCard);

    sendGameMessage(bridge, room, {
      key: 'GAME.LOGS.PLAYER_DEFUSE',
      options: {
        component: {
          name: card.props.name,
        },
      },
    });

    return true;
  }

  player.exploded = true;

  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_EXPLODE',
  });
  bridge.emit(player.id, 'endGame', { win: false });
  room.killPlayer();

  gameUpdate(bridge, room);

  if (room.gameEnded) {
    const winner = room.players[0];

    bridge.emit(winner.id, 'endGame', { win: true });

    room.gameEnd();
  }

  return false;
}
