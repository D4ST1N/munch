export default function getElementPosition({ target, clientX = 0, clientY = 0 }, inverse = false) {
  const rect = target.getBoundingClientRect();

  return {
    x: clientX - rect.left * (inverse ? -1 : 1),
    y: clientY - rect.top * (inverse ? -1 : 1),
  };
}
