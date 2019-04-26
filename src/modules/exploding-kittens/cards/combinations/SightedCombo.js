import sendPlayerUseCombinationOnPlayer
  from '../../helpers/messages/sendPlayerUseCombinationOnPlayer';
import gameUpdate from '../../helpers/gameUpdate';
import removeTargetFromPlayers from '../../helpers/removeTargetFromPlayers';

export default {
  apply(bridge, room, player, options) {
    console.log('get player card');
    const selectedPlayer = room.getPlayer(options.name);
    const selectedCard = options.card;
    const selectedPlayerHasCard = selectedPlayer.deck.hasCardOfName(selectedCard.props.name);

    sendPlayerUseCombinationOnPlayer(bridge, room, 3, selectedPlayer.name);

    if (selectedPlayerHasCard) {
      const usedCard = selectedPlayer.deck.useCardByName(selectedCard.props.name);
      player.deck.addCard(...usedCard);
      player.emit('getCard', ...usedCard);
      selectedPlayer.emit('looseCard', ...usedCard);
      removeTargetFromPlayers(room, selectedPlayer.name);

      gameUpdate(bridge, room);
    } else {
      bridge.emit(player.id, 'gameMessage', {
        key: 'NOTIFICATIONS.GAME.PLAYER_HAS_NOT_CARD',
      });
    }
  }
}
