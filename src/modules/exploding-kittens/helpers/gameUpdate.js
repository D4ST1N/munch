const sendUpdateToUser = (bridge, room, userName, isWatcher = false) => {
  const correctMethod = !isWatcher
    ? 'getPlayer'
    : 'getWatcher';
  const user = room[correctMethod](userName);

  const invertedDeck = room.invertedDeck;
  const currentPlayer = room.currentPlayer.name;
  const players = room.playersList();

  let gameData = {
    players,
    currentPlayer,
    gameDeck: invertedDeck,
    gameTrash: room.trash.cards,
    playerDeck: !isWatcher ? user.deck.cards : [],
  };

  console.log('send game update to ', user.name);
  bridge.emit(user.id, 'gameUpdate', gameData);
};

const sendUpdateToAllTypes = (bridge, room, isWatcher = false) => {
  const correctArray = isWatcher
      ? 'watchers'
      : 'players';

  const userExists = room[correctArray].length > 0;

  if (userExists) {
    room[correctArray].forEach((user) => {
      console.log('send game update to ', user.name);
      sendUpdateToUser(bridge, room, user.name, isWatcher)
    });
  }
};

export default function gameUpdate(bridge, room, playerName, watcherName) {
  if (room.status === 'wait') {
    return;
  }

  console.log('gameUpdate');
  if (playerName) {
    sendUpdateToUser(bridge, room, playerName)
  } else if (watcherName) {
    sendUpdateToUser(bridge, room, watcherName, true)
  } else {
    sendUpdateToAllTypes(bridge, room, false);
    sendUpdateToAllTypes(bridge, room, true);
  }
}
