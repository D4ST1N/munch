import gameUpdate from './gameUpdate';

export default function delayedGameUpdate(bridge, room, timeout = 150) {
  gameUpdate(bridge, room);
  setTimeout(() => {
    gameUpdate(bridge, room);
  }, timeout);
}
