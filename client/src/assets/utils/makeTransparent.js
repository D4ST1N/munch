export default function makeTransparent(color, opacity = 0.25) {
  return color.replace(/,\s?1\)/, `, ${opacity})`);
}
