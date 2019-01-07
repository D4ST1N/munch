export default function personalizeText(text, name, current) {
  return `${text}.${name === current ? 'YOU' : 'OTHER'}`;
}
