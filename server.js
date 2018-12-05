const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/client/dist'));

// Routes
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});


const players = {};

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

    if (movement.left) {
      player.x -= 5;
    }

    if (movement.up) {
      player.y -= 5;
    }

    if (movement.right) {
      player.x += 5;
    }

    if (movement.down) {
      player.y += 5;
    }
  });

  socket.on('disconnect', () => {
    if (players[socket.id]) {
      players[socket.id].active = false;
    }
  });
});

const filteredPlayers = () => (
  Object.keys(players)
        .filter(player => player.active)
        .reduce((obj, key) => {
          obj[key] = players[key];
          return obj;
        }, {})
);

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
