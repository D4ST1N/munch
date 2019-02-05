import Vue     from 'vue';
import store   from './store'
import App     from './App.vue';
import router  from './router';
import getText from './assets/utils/getText';
// UI Components
import Button  from './components/UI/Button';
import Icon  from './components/UI/Icon';

Vue.prototype.$text = getText;
Vue.config.productionTip = true;
Vue.config.devtools = true;

Vue.component('Button', Button);
Vue.component('Icon', Icon);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
