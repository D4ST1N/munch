import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home';
import CircleCrush from './components/CIrcleCrush/CircleCrush';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/circle-crush',
      name: 'Circle Crush!',
      component: CircleCrush,
      meta: {
        title: 'Circle Crush!',
      },
    },
  ],
  mode: 'history',
});
