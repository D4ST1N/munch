import sendPlayerUseCombinationOnPlayer
  from '../../helpers/messages/sendPlayerUseCombinationOnPlayer';
import shuffle from '../../../../utils/shuffle';
import gameUpdate from '../../helpers/gameUpdate';
import removeTargetFromPlayers from '../../helpers/removeTargetFromPlayers';

export default {
  apply(bridge, room, player, options) {
    console.log('choose player card');
    const selectedPlayer = room.getPlayer(options.name);

    sendPlayerUseCombinationOnPlayer(bridge, room, 2, selectedPlayer.name);

    bridge.emit(player.id, 'showCardList', {
      deck: shuffle([...selectedPlayer.deck.inverted]),
      event: 'selectPlayerCard',
    });

    const onPlayerSelectCard = (socket, { card }) => {
      const usedCard = selectedPlayer.deck.useCard(card.id);

      if (usedCard === false) {
        console.log(selectedPlayer.deck.cards, card);
      } else {
        console.log(usedCard);
        player.deck.addCard(...usedCard);
        player.emit('getCard', ...usedCard);
        selectedPlayer.emit('looseCard', ...usedCard);
        removeTargetFromPlayers(room, selectedPlayer.name);
        gameUpdate(bridge, room);

        bridge.off('selectPlayerCard', onPlayerSelectCard);
      }
    };

    bridge.on('selectPlayerCard', onPlayerSelectCard);
  },
}
