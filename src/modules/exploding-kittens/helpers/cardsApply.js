import sendGameMessage from './sendGameMessage';
import gameUpdate      from './gameUpdate';
import shuffle         from '../../../utils/shuffle';
import cardsCancel     from './cardsCancel';
import playerGetCard   from './playerGetCard';
import Card            from '../entities/Card';
import seeTheFuture    from './cards/seeTheFuture';
import changeTheFuture from './cards/changeTheFuture';

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
        }, 150);
        gameUpdate(bridge, room);
        room.logs.push({
          text: 'LOGS.PLAYER_USE_SHUFFLE',
          options: {
            player: room.currentPlayer.name,
          },
        });

        break;

      case 'see-the-future':
        seeTheFuture(bridge, room, player);

        break;

      case 'see-the-future-x5':
        seeTheFuture(bridge, room, player, 5);

        break;

      case 'change-the-future':
        changeTheFuture(bridge, room, player);

        break;

      case 'change-the-future-x5':
        changeTheFuture(bridge, room, player, 5);

        break;

      case 'swap-top-and-bottom':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SWAP_TOP_AND_BOTTOM', room);

        const cards = room.deck.cards;
        const last = cards.length - 1;
        [ cards[0], cards[last] ] = [ cards[last], cards[0] ];

        gameUpdate(bridge, room);
        setTimeout(() => {
          gameUpdate(bridge, room);
        }, 150);

        break;

      case 'skip':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SKIP', room);

        if (!room.playerEndMove()) {
          room.nextPlayer();
        }

        room.logs.push({
          text: 'LOGS.PLAYER_SKIP_MOVE',
          options: {
            player: room.currentPlayer.name,
          },
        });

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        room.logs.push({
          text: 'LOGS.PLAYER_MOVE',
          options: {
            player: room.currentPlayer.name,
          },
        });
        gameUpdate(bridge, room);

        break;

      case 'freedom':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_FREEDOM', room);

        room.penaltyBackup = room.penaltyMoves;
        room.penaltyMoves = 0;
        room.nextPlayer();

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);

        gameUpdate(bridge, room);
        break;

      case 'attack':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_ATTACK', room);

        room.nextPlayer();
        room.penaltyMoves += 2;

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        room.logs.push({
          text: 'LOGS.PLAYER_MOVE',
          options: {
            player: room.currentPlayer.name,
          },
        });
        gameUpdate(bridge, room);

        break;

      case 'nope':
        const previousPart = room.history.current.parts[room.history.current.parts.length - 2];

        if (previousPart) {
          cardsCancel(bridge, previousPart.deck.cards, room, socket, options);
        }

        break;

      case 'get-lower':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_GET_LOWER', room, player.name);
        playerGetCard(bridge, room, player.name, false);

        break;

      case 'reverse':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_REVERSE', room, player.name);
        room.reverse();

        if (!room.playerEndMove()) {
          room.nextPlayer();
        }

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_TURN', room);
        gameUpdate(bridge, room);

        break;

      case 'attack-target':
        const attackedPlayer = room.getPlayer(options.name);

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_ATTACK_TARGET', room, player.name, {
          whom: attackedPlayer.name,
        });

        room.nextPlayer(attackedPlayer.name);
        room.penaltyMoves += 2;
        gameUpdate(bridge, room);

        break;

      case 'catomic-bomb':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_CATOMIC_BOMB', room, player.name);

        const explodingKittens = ['exploding-kitten', 'imploding-kitten'];
        const explodingCards = room.deck.cards.filter(card => explodingKittens.includes(card.props.type));
        const saveCards = room.deck.cards.filter(card => !explodingKittens.includes(card.props.type));

        room.deck.cards = [].concat(saveCards, explodingCards);
        room.nextPlayer();
        gameUpdate(bridge, room);
        setTimeout(() => {
          gameUpdate(bridge, room);
        }, 150);

        break;

      case 'swap':
        console.log(options);
        const swapPlayer = room.getPlayer(options.name);
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_SWAP', room, player.name, {
          whom: swapPlayer.name,
        });
        const swapPlayerCards = swapPlayer.deck.cards;
        swapPlayer.deck.cards = player.deck.cards;
        player.deck.cards = swapPlayerCards;
        gameUpdate(bridge, room);

        break;

      case 'garbage-collector':
        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_GARBAGE_COLLECTOR', room, player.name);

        room.players.forEach((somePlayer) => {
          if (somePlayer.name === player.name) return;

          const usedCard = somePlayer.deck.useRandomCard();
          room.trash.addCard(...usedCard);
          somePlayer.emit('looseCard', ...usedCard);
          gameUpdate(bridge, room);

        });
        break;

      case 'favor':
        console.log(options);
        const favorPlayer = room.getPlayer(options.name);
        const playerHasStop = favorPlayer.deck.hasCardOfType('nope');

        sendGameMessage(bridge, 'NOTIFICATIONS.GAME.PLAYER_USE_FAVOR', room, player.name, {
          whom: favorPlayer.name,
        });
        gameUpdate(bridge, room);
        room.logs.push({
          text: 'LOGS.PLAYER_USE_FAVOR',
          options: {
            player: room.currentPlayer.name,
            whom: favorPlayer.name,
          },
        });

        console.log('send favor event to', favorPlayer.name);
        bridge.emit(favorPlayer.id, 'playerUseFavor', {
          name: player.name,
          actionEnabled: playerHasStop,
        });

        const onPlayerSelectFavorCard = (socket, { room, cards }) => {
          const [card] = cards;
          console.log(player);

          try {
            const usedCard = favorPlayer.deck.useCard(card.id);
            player.deck.addCard(...usedCard);
            player.emit('getCard', ...usedCard);
            favorPlayer.emit('looseCard', ...usedCard);
          } catch (e) {
            console.error(e);
            console.log(card.id, card.props.type);
            console.log(favorPlayer.deck.cards.map(card => card.id));
            room.currentPlayer.deck.addCard(Card.newCard('favor'));
          }

          gameUpdate(bridge, room);
          bridge.off('playerSelectFavorCard', onPlayerSelectFavorCard);
          room.logs.push({
            text: 'LOGS.PLAYER_GIVE_CARD',
            options: {
              player: favorPlayer.name,
            },
            deck: [...cards],
          });
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
    room.logs.push({
      text: 'LOGS.PLAYER_USE_TWO_CARDS_COMBO',
      options: {
        player: player.name,
        whom: selectedPlayer.name,
      },
      deck: [...cards],
    });

    const onPlayerSelectCard = (socket, { card }) => {
      const usedCard = selectedPlayer.deck.useCard(card.id);

      if (usedCard === false) {
        console.log(selectedPlayer.deck.cards, card);
      } else {
        room.logs.push({
          text: 'LOGS.PLAYER_GET_CARD',
          options: {
            player: player.name,
          },
          deck: [{ ...usedCard }],
        });

        console.log(usedCard);
        player.deck.addCard(...usedCard);
        player.emit('getCard', ...usedCard);
        selectedPlayer.emit('looseCard', ...usedCard);
        gameUpdate(bridge, room);

        bridge.off('selectPlayerCard', onPlayerSelectCard);
      }
    };

    bridge.on('selectPlayerCard', onPlayerSelectCard);
  } else if (cards.length === 3) {
    console.log('get player card');
    const selectedPlayer = room.getPlayer(options.name);
    const selectedCard = options.card;
    const selectedPlayerHasCard = selectedPlayer.deck.hasCardOfType(selectedCard.props.type);
    room.logs.push({
      text: 'LOGS.PLAYER_USE_THREE_CARDS_COMBO',
      options: {
        player: player.name,
        whom: selectedPlayer.name,
        card: selectedCard.props.type
      },
      deck: [...cards],
    });

    if (selectedPlayerHasCard) {
      const usedCard = selectedPlayer.deck.useCardByType(selectedCard.props.type);
      room.logs.push({
        text: 'LOGS.PLAYER_GET_CARD',
        options: {
          player: player.name,
        },
        deck: [{ ...usedCard }],
      });
      player.deck.addCard(...usedCard);
      player.emit('getCard', ...usedCard);
      selectedPlayer.emit('looseCard', ...usedCard);
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
    room.logs.push({
      text: 'LOGS.PLAYER_USE_FIVE_CARDS_COMBO',
      options: {
        player: player.name,
      },
      deck: [...cards],
    });

    const onSelectTrashCard = (socket, { card }) => {
      room.logs.push({
        text: 'LOGS.PLAYER_GET_CARD',
        options: {
          player: player.name,
        },
        deck: [{ ...card }],
      });
      const usedCard = room.trash.useCard(card.id);
      player.deck.addCard(...usedCard);
      player.emit('getCard', ...usedCard);
      gameUpdate(bridge, room);
      bridge.off('selectTrashCard', onSelectTrashCard);
    };

    bridge.on('selectTrashCard', onSelectTrashCard);
  }
}
