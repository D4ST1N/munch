export default function getColorParts(color) {
  const [r, g, b] = color.match(/\d+/g);

  return { r, g, b };
}
