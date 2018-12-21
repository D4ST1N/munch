import Vue              from 'vue';
import Router           from 'vue-router';
import store            from './store'
import Home             from './components/Home';
import CircleCrush      from './components/CircleCrush/CircleCrush';
import GameRoomList     from './components/ExplodingKittens/GameRoomsList';
import PlayerAuth       from './components/ExplodingKittens/PlayerAuth';
import GameRoom         from './components/ExplodingKittens/GameRoom';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/circle-crush',
      name: 'circle-crush',
      component: CircleCrush,
      meta: {
        title: 'Circle Crush!',
      },
    },
    {
      path: '/exploding-kittens',
      name: 'exploding-kittens',
      component: GameRoomList,
      meta: {
        title: 'Exploding kittens game rooms',
      },
    },
    {
      path: '/exploding-kittens/auth',
      name: 'auth',
      component: PlayerAuth,
      meta: {
        title: 'Player authorization',
      },
    },
    {
      path: '/exploding-kittens/room/:id',
      name: 'exploding-kittens/room',
      component: GameRoom,
      meta: {
        title: 'Exploding kittens',
      },
    },
  ],
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  if (!store.getters.player && to.name !== 'auth') {
    next('/exploding-kittens/auth');
  } else {
    next();
  }
});

export default router;
