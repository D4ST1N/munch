import Vue from 'vue';
import Router from 'vue-router';
import Lobby from './components/scenes/Lobby/Lobby';
import PlayerAuth from './components/ExplodingKittens/PlayerAuth';
import Room from './components/scenes/Room/Room';
import RoomNotFound from './components/scenes/Room/RoomNotFound';
import Game from './components/scenes/Game/Game';
import Results from './components/scenes/Results/Results';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'exploding-kittens',
      component: Lobby,
      meta: {
        title: 'Exploding kittens game rooms',
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
      path: '/room/404',
      name: 'room-not-found',
      component: RoomNotFound,
      meta: {
        title: 'Room not found',
      },
    },
    {
      path: '/room/:id/lobby',
      name: 'room-lobby',
      component: Room,
      meta: {
        title: 'Room lobby',
      },
    },
    {
      path: '/room/:id/game',
      name: 'game',
      component: Game,
      meta: {
        title: 'Game',
      },
    },
    {
      path: '/room/:id/results',
      name: 'game-results',
      component: Results,
      meta: {
        title: 'Game results',
      },
    },
  ],
  mode: 'history',
});

export default router;
