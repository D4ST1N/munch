import config from '../configs/circle-crush';
import randomInt from './randomInt';

export default function createBarricade() {
  const horizontal = !!randomInt(0, 1);
  const size = {};

  if (horizontal) {
    size.width = randomInt(config.barricades.minWidth, config.barricades.maxWidth);
    size.height = randomInt(config.barricades.minHeight, config.barricades.maxHeight);
  } else {
    size.width = randomInt(config.barricades.minHeight, config.barricades.maxHeight);
    size.height = randomInt(config.barricades.minWidth, config.barricades.maxWidth);
  }

  const pos = {
    x: randomInt(0, config.fieldSize.width - size.width),
    y: randomInt(0, config.fieldSize.height - size.height),
  };

  return {
    size,
    pos,
    color: '#fff',
  };
}
