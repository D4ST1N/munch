export default {
  game: {
    minPlayerCount: 2,
    cardSettings: {
      width: 140,
      height: 180,
      distance: 10,
    },
    field: {
      width: 2000,
    },
    combinationTimeout: {
      2: 7500,
      3: 8000,
      5: 10000,
    },
  },
  options: {
    fastGame: {
      name: 'fast-game',
      label: 'GAME_ROOMS.QUICK_GAME',
      selected: true,
      disabled: false,
    },
    timeLimit: {
      name: 'time-limit',
      label: 'GAME_ROOMS.TIME_LIMIT',
      selected: false,
      disabled: true,
    },
  },
  packs: [
    {
      name: 'base',
      label: 'GAME_ROOMS.PACKS.BASE',
      selected: true,
      disabled: true,
    },
    {
      name: 'imploding-kittens',
      label: 'GAME_ROOMS.PACKS.IMPLODING_KITTENS',
      selected: true,
      disabled: false,
    },
    {
      name: 'streaking-kittens',
      label: 'GAME_ROOMS.PACKS.STREAKING_KITTENS',
      selected: true,
      disabled: false,
    },
    {
      name: 'extension-pack-3',
      label: 'GAME_ROOMS.PACKS.EXTENSION_PACK_3',
      selected: true,
      disabled: false,
    },
  ],
  cards: [
    {
      name: 'defuse',
      label: 'CARDS.DEFUSE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.DEFUSE.DESCRIPTION',
      color: '#66bb6a',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount + (Math.ceil(playersCount / 2));
      },
    },
    {
      name: 'exploding-kitten',
      label: 'CARDS.EXPLODING_KITTEN.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.EXPLODING_KITTEN.DESCRIPTION',
      color: '#212121',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount, selectedCards) {
        return selectedCards.includes('imploding-kitten') && playersCount > 2
          ? playersCount - 2
          : playersCount - 1;
      },
    },
    {
      name: 'attack',
      label: 'CARDS.ATTACK.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.ATTACK.DESCRIPTION',
      color: '#ffa000',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'shuffle',
      label: 'CARDS.SHUFFLE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.SHUFFLE.DESCRIPTION',
      color: '#be7c34',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'see-the-future',
      label: 'CARDS.SEE_THE_FUTURE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.SEE_THE_FUTURE.DESCRIPTION',
      color: '#ec407a',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'favor',
      label: 'CARDS.FAVOR.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.FAVOR.DESCRIPTION',
      color: '#607d8b',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: true,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'nope',
      label: 'CARDS.NOPE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.NOPE.DESCRIPTION',
      color: '#f44336',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'skip',
      label: 'CARDS.SKIP.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.SKIP.DESCRIPTION',
      color: '#2196f3',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'avocado',
      label: 'CARDS.AVOCADO.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.AVOCADO.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'banana',
      label: 'CARDS.BANANA.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.BANANA.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'mango',
      label: 'CARDS.MANGO.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.MANGO.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'pineapple',
      label: 'CARDS.PINEAPPLE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.PINEAPPLE.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'orange',
      label: 'CARDS.ORANGE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.ORANGE.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'apple',
      label: 'CARDS.APPLE.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.APPLE.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'grapes',
      label: 'CARDS.GRAPES.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.GRAPES.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'cherry',
      label: 'CARDS.CHERRY.NAME',
      selected: true,
      disabled: true,
      description: 'CARDS.CHERRY.DESCRIPTION',
      color: '#009688',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'base',

      count(playersCount) {
        return playersCount > 4;
      },
    },
    {
      name: 'imploding-kitten',
      label: 'CARDS.IMPLODING_KITTEN.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.IMPLODING_KITTEN.DESCRIPTION',
      color: '#080c3b',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 2 ? 1 : 0;
      },
    },
    {
      name: 'get-lower',
      label: 'CARDS.GET_LOWER.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.GET_LOWER.DESCRIPTION',
      color: '#cddc39',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'gmo',
      label: 'CARDS.GMO.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.GMO.DESCRIPTION',
      color: '#2b6c74',
      isFruitCard: true,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'reverse',
      label: 'CARDS.REVERSE.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.REVERSE.DESCRIPTION',
      color: '#009688',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'attack-target',
      label: 'CARDS.ATTACK_TARGET.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.ATTACK_TARGET.DESCRIPTION',
      color: '#ef6c00',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: true,
      time: 0,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'change-the-future',
      label: 'CARDS.CHANGE_THE_FUTURE.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.CHANGE_THE_FUTURE.DESCRIPTION',
      color: '#7b1fa2',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'imploding-kittens',

      count(playersCount) {
        return playersCount > 3 ? 6 : 4;
      },
    },
    {
      name: 'see-the-future-x5',
      label: 'CARDS.SEE_THE_FUTURE_X5.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.SEE_THE_FUTURE_X5.DESCRIPTION',
      color: '#b4315d',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'change-the-future-x5',
      label: 'CARDS.CHANGE_THE_FUTURE_X5.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.CHANGE_THE_FUTURE_X5.DESCRIPTION',
      color: '#5a1777',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'swap-top-and-bottom',
      label: 'CARDS.SWAP_TOP_AND_BOTTOM.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.SWAP_TOP_AND_BOTTOM.DESCRIPTION',
      color: '#00acc1',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'freedom',
      label: 'CARDS.FREEDOM.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.FREEDOM.DESCRIPTION',
      color: '#145d9c',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'catomic-bomb',
      label: 'CARDS.CATOMIC_BOMB.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.CATOMIC_BOMB.DESCRIPTION',
      color: '#e80055',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: true,
      selectPlayer: false,
      time: 0,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'garbage-collector',
      label: 'CARDS.GARBAGE_COLLECTOR.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.GARBAGE_COLLECTOR.DESCRIPTION',
      color: '#5d4037',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: false,
      time: 5000,
      pack: 'streaking-kittens',

      count(playersCount) {
        return playersCount > 3 ? 4 : 2;
      },
    },
    {
      name: 'cat-box',
      label: 'CARDS.CAT_BOX.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.CAT_BOX.DESCRIPTION',
      color: '#008336',
      isFruitCard: false,
      actionCard: false,
      canBeUsed: false,
      selectPlayer: false,
      time: 0,
      pack: 'streaking-kittens',

      count() {
        return 1;
      },
    },
    {
      name: 'swap',
      label: 'CARDS.SWAP.NAME',
      selected: true,
      disabled: false,
      description: 'CARDS.SWAP.DESCRIPTION',
      color: '#512da8',
      isFruitCard: false,
      actionCard: true,
      canBeUsed: true,
      selectPlayer: true,
      time: 5000,
      pack: 'extension-pack-3',

      count() {
        return 2;
      },
    },
  ],
};
