import sendPlayerUseCard from '../helpers/messages/sendPlayerUseCard';
import delayedGameUpdate from '../helpers/delayedGameUpdate';

export default {
  apply(bridge, room, card) {
    sendPlayerUseCard(bridge, room, card.props.name);

    const explodingKittens = ['exploding-kitten', 'imploding-kitten'];
    const explodingCards = room.deck.cards.filter(card => explodingKittens.includes(card.props.name));
    const saveCards = room.deck.cards.filter(card => !explodingKittens.includes(card.props.name));

    console.log(saveCards, explodingCards);

    room.deck.cards = [].concat(saveCards, explodingCards);
    room.nextPlayer();

    delayedGameUpdate(bridge, room);
  }
}
