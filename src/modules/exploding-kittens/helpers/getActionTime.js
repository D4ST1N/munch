import settings from '../../../settings';

export default function getActionTime(cards) {
  if (cards.length === 1) {
    const [card] = cards;
    return card.props.time;
  } else {
    return settings.game.combinationTimeout[cards.length];
  }
}
