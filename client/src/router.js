import Vue              from 'vue';
import Router           from 'vue-router';
import Home             from './components/Home';
import CircleCrush      from './components/CircleCrush/CircleCrush';
import ExplodingKittens from './components/ExplodingKittens/ExplodingKittens';

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
    {
      path: '/exploding-kittens',
      name: 'Exploding kittens',
      component: ExplodingKittens,
      meta: {
        title: 'Exploding kittens',
      },
    },
  ],
  mode: 'history',
});
