import Card from '../entities/Card';
import gameUpdate from '../helpers/gameUpdate';
import sendPlayerUseCardOnPLayer from '../helpers/messages/sendPlayerUseCardOnPLayer';
import sendPlayerBlockCard from '../helpers/messages/sendPlayerBlockCard';
import endFavor from '../helpers/endFavor';
import removeTargetFromPlayers from '../helpers/removeTargetFromPlayers';
import sendPlayerGiveCard from '../helpers/messages/sendPlayerGiveCard';

export default {
  apply(bridge, room, card, player, options) {
    const favorPlayer = room.getPlayer(options.name);

    favorPlayer.selected = true;

    sendPlayerUseCardOnPLayer(bridge, room, card.props.name, favorPlayer.name);
    gameUpdate(bridge, room);

    const onPlayerSelectFavorCard = (socket, { room, cards }) => {
      const [card] = cards;
      console.log(player);

      try {
        const usedCard = favorPlayer.deck.useCard(card.id);
        player.deck.addCard(...usedCard);
        player.emit('getCard', ...usedCard);
        favorPlayer.emit('looseCard', ...usedCard);
        sendPlayerGiveCard(bridge, room, favorPlayer.name);
      } catch (e) {
        console.error(e);
        console.log(card.id, card.props.name);
        console.log(favorPlayer.deck.cards.map(card => card.id));
        room.currentPlayer.deck.addCard(Card.newCard('favor'));
      }

      endFavor(room);
      removeTargetFromPlayers(room, favorPlayer.name);

      gameUpdate(bridge, room);
      bridge.off('playerSelectFavorCard', onPlayerSelectFavorCard);
    };

    bridge.on('playerSelectFavorCard', onPlayerSelectFavorCard);
  },

  cancel(bridge, room, card) {
    sendPlayerBlockCard(bridge, room, card.props.name);

    endFavor(room);

    gameUpdate(bridge, room);
  }
}
