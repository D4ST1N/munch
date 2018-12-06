const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const collision = require('./src/utils/collision');
const config = require('./src/config');

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/client/dist'));

// Routes
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/config.json'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});


const players = {};
const bullets = [];

// sockets
io.on('connection', function(socket) {
  socket.on('newPlayer', function() {
    console.log('new ', socket.id);
    players[socket.id] = {
      x: 300,
      y: 300,
      active: true,
    };

    io.sockets.emit('message', socket.id);
  });

  socket.on('playerConnect', function (playerId) {
    console.log('old ', playerId);
    players[playerId] = players[playerId] || {
      x: 300,
      y: 300,
    };
    players[playerId].active = true;
  });

  socket.on('movement', function({ id, movement }) {
    if (!id || !movement) return;

    const player = players[id] || {};
    const moveDiagonally = movement.left && movement.up
      || movement.left && movement.down
      || movement.right && movement.up
      || movement.right && movement.down;
    let speed = config.playerSpeed;

    if (moveDiagonally) {
      speed = Math.sqrt(config.playerSpeed ** 2 - (Math.sqrt(2 * config.playerSpeed ** 2) / 2) ** 2);
    }

    if (movement.left) {
      player.x -= speed;
      player.x = Math.max(player.x, 0);
    }

    if (movement.up) {
      player.y -= speed;
      player.y = Math.max(player.y, 0);
    }

    if (movement.right) {
      player.x += speed;
      player.x = Math.min(player.x, config.fieldSize.width);
    }

    if (movement.down) {
      player.y += speed;
      player.y = Math.min(player.y, config.fieldSize.height);
    }
  });

  socket.on('shoot', (bullet) => {
    bullets.push(bullet);
  });

  socket.on('disconnect', () => {
    if (players[socket.id]) {
      players[socket.id].active = false;
    }
  });
});

const filteredPlayers = () => (
  Object.entries(players)
        .filter(([id, player]) => player.active)
        .reduce((obj, [id, player]) => {
          obj[id] = player;
          return obj;
        }, {})
);

const clearBulletsList = () => {
  if (bullets.length === 0) {
    return;
  }

  let i = bullets.length - 1;

  while (i > -1) {
    if (bullets[i].pos.x < 0 || bullets[i].pos.x > config.fieldSize.width) {
      bullets.splice(i, 1);
    } else if (bullets[i].pos.y < 0 || bullets[i].pos.y > config.fieldSize.height) {
      bullets.splice(i, 1);
    } else {
      bullets[i].pos.x += bullets[i].direction.x;
      bullets[i].pos.y += bullets[i].direction.y;
    }

    i--;
  }
};

const checkCollision = () => {
  Object.values(filteredPlayers()).forEach((player) => {
    let result = false;

    for (let i = 0; i < bullets.length; ) {
      if (collision.test.rectCircle({
        pos: bullets[i].pos,
        size: 2
      }, {
        pos: {
          x: player.x,
          y: player.y,
        },
        size: 16,
      })) {
        result = true;
        bullets.splice(i, 1);
      } else {
        i++;
      }
    }

    if (result) {
      console.log('shooted!');
      player.active = false;
    }
  });
};

setInterval(function() {
  clearBulletsList();
  checkCollision();

  io.sockets.emit('state', {
    bullets,
    players: filteredPlayers(),
  });
}, 1000 / 60);
