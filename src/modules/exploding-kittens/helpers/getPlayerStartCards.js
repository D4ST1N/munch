import getCards from './getCards';

export default function getPlayerStartCards(deck) {
  return [
    ...getCards(deck, 5, ['exploding-kitten', 'defuse']),
    ...getCards(deck, 1, [], 'defuse'),
  ]
}
