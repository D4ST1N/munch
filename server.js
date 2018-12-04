const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routes
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});


const players = {};

// sockets
io.on('connection', function(socket) {
  socket.on('new player', function() {
    console.log(socket.id);
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
