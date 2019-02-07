/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */

export default function shuffle(a) {
  return [ ...a.sort(() => 0.5 - Math.random()) ];
}
