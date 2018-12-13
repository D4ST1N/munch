const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.Server(app);
const circleCrush = require('./src/modules/circle-crush');

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/client/dist'));

// Routes
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/circle-crush', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/circle-crush/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/configs/circle-crush.json'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});

circleCrush(server);
