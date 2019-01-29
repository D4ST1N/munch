export default function gameUpdate(bridge, room, playerName) {
  if (room.status === 'wait') {
    return;
  }

  const invertedDeck = room.invertedDeck;
  const currentPlayer = room.currentPlayer.name;
  const players = room.playersList();

  console.log('gameUpdate');
  if (playerName) {
    const player = room.getPlayer(playerName);
    console.log('send game update to ', player.name);
    bridge.emit(player.id, 'gameUpdate', {
      players,
      currentPlayer,
      gameDeck: invertedDeck,
      gameTrash: room.trash.cards,
      playerDeck: player.deck.cards,
    });
  } else {
    room.players.forEach((player) => {
      console.log('send game update to ', player.name);
      bridge.emit(player.id, 'gameUpdate', {
        players,
        currentPlayer,
        gameDeck: invertedDeck,
        gameTrash: room.trash.cards,
        playerDeck: player.deck.cards,
      });
    });
  }
}
