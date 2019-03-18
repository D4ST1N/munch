import Vue              from 'vue';
import Router           from 'vue-router';
import CircleCrush      from './components/CircleCrush/CircleCrush';
import GameRoomList     from './components/ExplodingKittens/GameRoomsList';
import PlayerAuth       from './components/ExplodingKittens/PlayerAuth';
import GameRoom         from './components/ExplodingKittens/GameRoom';
import RoomLogs         from './components/ExplodingKittens/RoomLogs';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'exploding-kittens',
      component: GameRoomList,
      meta: {
        title: 'Exploding kittens game rooms',
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
      path: '/auth',
      name: 'auth',
      component: PlayerAuth,
      meta: {
        title: 'Player authorization',
      },
    },
    {
      path: '/room/:id',
      name: 'exploding-kittens/room',
      component: GameRoom,
      meta: {
        title: 'Exploding kittens',
      },
    },
    {
      path: '/room/:id/logs',
      name: 'exploding-kittens/room/logs',
      component: RoomLogs,
      meta: {
        title: 'Exploding kittens',
      },
    },
  ],
  mode: 'history',
});

export default router;
