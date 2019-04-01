import randomInt from '../../../utils/randomInt';

const names = [
  'Anakin Skywalker',
  'Leia Organa',
  'Luke Skywalker',
  'Obi-Wan Kenobi',
  'Chewbacca',
  'Han Solo',
  'Lando Calrissian',
  'R2-D2',
  'C-3PO',
  'Yoda',
  'Mace Windu',
  'Boba Fett',
  'Jabba the Hutt',
  'Qui-Gon Jinn',
  'Darth Maul',
  'Captain Phasma',
  'Kylo Ren',
  'Rey',
  'Padme Amidala',
  'Jar Jar Binks',
  'Darth Sidious',
];

export default {
  get() {
    const notUsedNames = names.filter(name => !this.used.includes(name));
    const name = notUsedNames[randomInt(0, notUsedNames.length - 1)];
    this.used.push(name);

    return name;
  },

  used: [],
}
