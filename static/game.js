const socket = io();

const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
const context = canvas.getContext('2d');

const movement = {
  up: false,
  down: false,
  left: false,
  right: false
};
let playersState = {};

document.addEventListener('keydown', (event) => {
  console.log(event.code);
  switch (event.code) {
    case 'KeyA':
      movement.left = true;
      break;
    case 'KeyW':
      movement.up = true;
      break;
    case 'KeyD':
      movement.right = true;
      break;
    case 'KeyS':
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyA':
      movement.left = false;
      break;
    case 'KeyW':
      movement.up = false;
      break;
    case 'KeyD':
      movement.right = false;
      break;
    case 'KeyS':
      movement.down = false;
      break;
  }
});

socket.emit('new player');

let gameTick = 0;
let fps = 0;
let lastTime = performance.now();
let raf;

const main = (now) => {
  gameTick = now - this.lastTime;

  const delta = this.gameTick / 1000;

  fps = Math.round(1 / delta);
  lastTime = now;

  socket.emit('movement', movement);
  render();

  raf = requestAnimationFrame(main);
};

const update = (newPlayersState) => {
  playersState = newPlayersState;
};

const render = () => {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';

  Object.values(playersState).forEach((player) => {
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  });
};

main(lastTime);

socket.on('state', update);
