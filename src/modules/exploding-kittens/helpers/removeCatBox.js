export default function removeCatBox(room) {
  room.players.forEach((player) => {
    const cardExist = player.deck.isCardExist('cat-box');

    if (cardExist) {
      player.deck.useCardByName('cat-box');
      player.emit('looseCard', ...card);
    }
  })
}
