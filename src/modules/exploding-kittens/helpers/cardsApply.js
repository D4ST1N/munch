import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';
import shuffle         from '../../../utils/shuffle';
import cardsCancel     from './cardsCancel';

export default function cardsApply(bridge, cards, room, socket, options) {
  const player = room.currentPlayer;
  console.log('Cards apply');

  if (cards.length === 1) {
    const [ card ] = cards;

    console.log(card);

    switch (card.props.type) {
      case 'shuffle':
        room.deck.shuffle();

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SHUFFLE', room);

        setTimeout(() => {
          gameUpdate(bridge, room);
        }, 500);
        gameUpdate(bridge, room);

        break;

      case 'see-the-future':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SEE_THE_FUTURE', room);
        gameUpdate(bridge, room);

        bridge.emit(player.id, 'seeTheFuture', room.deck.cards.slice(-3));
        bridge.on('endSeeTheFuture', (socket, { room }) => {
          gameUpdate(bridge, room);
          bridge.off('endSeeTheFuture');
        });

        break;

      case 'skip':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SKIP', room);

        if (!room.playerEndMove()) {
          room.nextPlayer();
        }

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        gameUpdate(bridge, room);

        break;

      case 'attack':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_ATTACK', room);

        room.nextPlayer();
        room.penaltyMoves += 2;

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        gameUpdate(bridge, room);

        break;

      case 'nope':
        const previousPart = room.history.current.parts[room.history.current.parts.length - 2];

        if (previousPart) {
          cardsCancel(bridge, previousPart.cards, room, socket, options);
        }

        break;

      case 'favor':
        console.log(options);
        const favorPlayer = room.getPlayer(options.name);
        const playerHasStop = favorPlayer.deck.hasCardOfType('nope');

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_FAVOR', room, player.name, {
          whom: favorPlayer.name,
        });
        gameUpdate(bridge, room);

        console.log('send favor event to', favorPlayer.name);
        bridge.emit(favorPlayer.id, 'playerUseFavor', {
          name: player.name,
          actionEnabled: playerHasStop,
        });

        const onPlayerSelectFavorCard = (socket, { room, cards }) => {
          const [card] = cards;

          player.deck.addCard(...favorPlayer.deck.useCard(card.id));
          gameUpdate(bridge, room);
          bridge.off('playerSelectFavorCard', onPlayerSelectFavorCard);
        };

        bridge.on('playerSelectFavorCard', onPlayerSelectFavorCard);

        break;

      default:
        break;
    }
  } else if (cards.length === 2) {
    console.log('choose player card');
    const selectedPlayer = room.getPlayer(options.name);

    bridge.emit(player.id, 'showCardList', {
      deck: shuffle([...selectedPlayer.deck.inverted]),
      event: 'selectPlayerCard',
    });

    const onPlayerSelectCard = (socket, { card }) => {
      player.deck.addCard(...selectedPlayer.deck.useCard(card.id));
      gameUpdate(bridge, room);

      bridge.off('selectPlayerCard', onPlayerSelectCard);
    };

    bridge.on('selectPlayerCard', onPlayerSelectCard);
  } else if (cards.length === 3) {
    console.log('get player card');
    const selectedPlayer = room.getPlayer(options.name);
    const selectedCard = options.card;
    const selectedPlayerHasCard = selectedPlayer.deck.hasCardOfType(selectedCard.props.type);

    if (selectedPlayerHasCard) {
      player.deck.addCard(...selectedPlayer.deck.useCardByType(selectedCard.props.type));
      gameUpdate(bridge, room);
    } else {
      bridge.emit(player.id, 'gameMessage', {
        text: 'NOTIFICATIONS.GAME.PLAYER_HAS_NOT_CARD',
      });
    }
  } else if (cards.length === 5) {
    console.log('select from trash');
    bridge.emit(player.id, 'showCardList', {
      deck: room.trash.cards,
      event: 'selectTrashCard',
    });

    const onSelectTrashCard = (socket, { card }) => {
      player.deck.addCard(...room.trash.useCard(card.id));
      gameUpdate(bridge, room);
      bridge.off('selectTrashCard', onSelectTrashCard);
    };

    bridge.on('selectTrashCard', onSelectTrashCard);
  }
}
