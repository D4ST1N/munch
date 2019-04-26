import getProp from './getProp';
import texts from '../texts/index';

export default function getText(
  key,
  options = {},
  locale = localStorage.getItem('locale') || window.locale || 'ua',
) {
  if (this.$route.query.showKeys) {
    return key;
  }

  // console.log(texts[locale], key, key);
  return getProp(texts[locale], key, key).replace(/{.+?}/gi, (match) => {
    const option = match.match(/[^{}]+/);

    if (options[option] !== undefined) {
      return options[option];
    }

    return match;
  });
}
