export default function isNopeCard(cards) {
  if (cards.length !== 1) {
    return false;
  }

  const [card] = cards;

  return card.props.type === 'nope';
}
