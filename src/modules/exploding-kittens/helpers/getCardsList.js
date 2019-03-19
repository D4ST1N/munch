export default function getCardsList(room) {
  return room.settings.packs.reduce((cards, pack) => {
    return cards.concat(pack.items.reduce((cards, item) => {
      cards.push(item.label);

      return cards;
    }, []));
  }, []);
}
