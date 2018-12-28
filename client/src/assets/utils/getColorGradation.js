import getColorParts from './getColorParts';

export default function getColorGradation(from, to, percent) {
  const colorFrom = getColorParts(from);
  const colorTo = getColorParts(to);

  const gradationColor = Object.entries(colorFrom).map(([color, value]) => {
    const difference = value - colorTo[color];

    return value - Math.round(difference / 100 * percent);
  });

  return `rgb(${ gradationColor.join() })`;
};
