import getProp from './getProp';
import texts from '../texts/index';

export default function getText(
  key,
  locale = localStorage.getItem('locale') || window.locale || 'ua',
) {
  return getProp(texts[locale], key, key);
}
