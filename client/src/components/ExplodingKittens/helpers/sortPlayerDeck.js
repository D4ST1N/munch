const getCardPriority = (card) => {
  if (card.props.type === 'defuse') {
    return 3;
  }

  return card.props.isCatCard ? 1 : 2;
};

export default function sortPlayerDeck(deck) {
  return deck.sort((leftCard, rightCard) => {
    let leftCardPriority = getCardPriority(leftCard);
    let rightCardPriority = getCardPriority(rightCard);

    if (leftCardPriority !== rightCardPriority) {
      return leftCardPriority > rightCardPriority ? 1 : -1;
    }

    return leftCard.props.type > rightCard.props.type ? 1 : -1;
  })
}
