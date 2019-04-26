import playerGetExplodingKitten from './playerGetExplodingKitten';
import writeLog                 from './writeLog';
import sendGameMessage          from './sendGameMessage';
import newMovePart                  from './newMovePart';
import gameUpdate               from './gameUpdate';
import playerGetImplodingKitten from './playerGetImplodingKitten';
import delayedGameUpdate from './delayedGameUpdate';
import removeCatBox from './removeCatBox';

export default function playerGetCard(bridge, room, name, upper = true) {
  const player = room.currentPlayer;

  if (player.name !== name) {
    return;
  }

  console.log(player);

  if (room.move) {
    room.move.partsCards.forEach(card => room.trash.addCard(card, false));
    room.move = null;
  }

  const card = upper
    ? room.deck.useUpperCard()
    : room.deck.useLowerCard();

  console.log('player get', card.props.name, 'card');
  let next = true;

  if (card.props.name === 'exploding-kitten') {
    player.deck.addCard(card);
    next = playerGetExplodingKitten(bridge, room, player, card);
  } else if (card.props.name === 'imploding-kitten') {
    next = playerGetImplodingKitten(bridge, room, player, card);
  } else {
    player.deck.addCard(card);
  }

  if (room.status === 'ended') {
    writeLog(room.id, room.logs);
  }

  if (next && room.status !== 'ended' && !room.playerEndMove()) {
    room.nextPlayer();
  }

  sendGameMessage(bridge, room, {
    key: 'GAME.LOGS.PLAYER_TURN',
  });
  // newMovePart(bridge, {
  //   room,
  //   player,
  //   cards,
  //   options,
  // });
  bridge.emit(room.id, 'updateMove', { cards: room.move ? room.move.partsCards : [] });
  delayedGameUpdate(bridge, room);

  if (room.deck.count === 0) {
    removeCatBox(room);
  }
}
