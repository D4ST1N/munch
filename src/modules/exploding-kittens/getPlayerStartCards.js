import getCards from './getCards';

export default function getPlayerStartCards(deck) {
  return [
    ...getCards(deck, 5, ['Вибухове кошеня', 'Знешкодь']),
    ...getCards(deck, 1, [], 'Знешкодь'),
  ]
}
