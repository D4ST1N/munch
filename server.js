import express          from 'express';
import http             from 'http';
import path             from 'path';
import circleCrush      from './src/modules/circle-crush';
import explodingKittens from './src/modules/exploding-kittens';

const app = express();
const server = http.Server(app);
circleCrush(server);
explodingKittens(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/client/dist'));

// Routes
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/circle-crush', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/exploding-kittens', (request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.get('/circle-crush/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/configs/circle-crush.json'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});

