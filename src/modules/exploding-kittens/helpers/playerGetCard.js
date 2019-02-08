import playerGetExplodingKitten from './playerGetExplodingKitten';
import writeLog                 from './writeLog';
import sendGameMessage          from './sendGameMessage';
import newMove                  from './newMove';
import gameUpdate               from './gameUpdate';

export default function playerGetCard(bridge, room, name, upper = true) {
  const player = room.currentPlayer;

  if (player.name !== name) {
    return;
  }

  const oldMove = room.history.current;

  if (oldMove) {
    oldMove.endMove();
    oldMove.allCards.forEach(card => room.trash.addCard(card, false));
  }

  const card = upper
    ? room.deck.useUpperCard()
    : room.deck.useLowerCard();

  console.log('player get', card.props.type, 'card');
  let next = true;
  room.logs.push({
    text: 'LOGS.PLAYER_GET_CARD',
    options: {
      player: name,
    },
    deck: [{...card}],
  });

  if (card.props.type === 'exploding-kitten') {
    next = playerGetExplodingKitten(bridge, room, player, card);
  } else {
    player.deck.addCard(card);
  }

  if (room.status === 'ended') {
    writeLog(room.id, room.logs);
  }

  if (next && room.status !== 'ended' && !room.playerEndMove()) {
    room.nextPlayer();
  }

  sendGameMessage(bridge,'NOTIFICATIONS.GAME.PLAYER_TURN', room);
  room.logs.push({
    text: 'LOGS.PLAYER_MOVE',
    options: {
      player: room.currentPlayer.name,
    },
  });
  newMove(bridge, room, room.currentPlayer);
  bridge.emit(room.id, 'updateMove', { cards: room.history.current.allCards });
  gameUpdate(bridge, room);
}
