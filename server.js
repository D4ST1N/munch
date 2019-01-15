import express          from 'express';
import http             from 'http';
import path             from 'path';
import circleCrush      from './src/modules/circle-crush';
import explodingKittens from './src/modules/exploding-kittens';

const app = express();
const server = http.Server(app);

circleCrush(server);
explodingKittens(server);

app.use('/static', express.static(__dirname + '/client/dist'));

app.get('/circle-crush/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/configs/circle-crush.json'));
});

app.use((request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});

export {
  app,
  server,
}
