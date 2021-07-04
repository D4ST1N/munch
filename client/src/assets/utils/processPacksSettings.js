export default function processPacksSettings(packs, cards) {
  const findPack = (packName) => packs.find(pack => pack.name === packName);

  cards.forEach((cardData) => {
    const pack = findPack(cardData.pack);

    if (!pack.items) {
      pack.items = [];
    }

    pack.items.push(cardData);
  });

  return packs;
}
