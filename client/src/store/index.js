import Vue from 'vue';
import Vuex from 'vuex';
import player from './modules/player';

Vue.config.devtools = true;
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    player,
  },
  strict: true,
});
