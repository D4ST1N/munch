import Vue     from 'vue';
import store   from './store'
import App     from './App.vue';
import router  from './router';
import getText from './assets/utils/getText';

Vue.prototype.$text = getText;
Vue.config.productionTip = true;
Vue.config.devtools = true;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
