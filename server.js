import express          from 'express';
import http             from 'http';
import path             from 'path';
import {
  createLogger,
  format,
  transports
}                       from 'winston';
import morgan           from 'morgan';
import circleCrush      from './src/modules/circle-crush';
import explodingKittens from './src/modules/exploding-kittens';

const { combine, printf } = format;
const { Console, File } = transports;
const app = express();
const server = http.Server(app);

const logFormat = printf(info => {
  return `${new Date()}: [${info.level}]: ${info.message}`;
});

const logger = createLogger({
  level: 'error',
  format: combine(
      logFormat
  ),
  transports: [
    new Console({
      handleExceptions: true
    }),
    new File({ filename: path.join(__dirname, './logs/combined.log'), level: 'error' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(__dirname, './logs/exceptions.log') })
  ],
  exitOnError: false,
});

logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

circleCrush(server);
explodingKittens(server);

app.use(morgan('combined', { stream: logger.stream }));

app.use('/static', express.static(__dirname + '/client/dist'));

app.get('/circle-crush/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/configs/circle-crush.json'));
});

app.use((request, response) => {
  response.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.log(err);

  return res
      .status(err.status || 500)
      .send({
        status: 'Error',
        error: {
          message: err.message
        }
      });
});

// Start server
server.listen(5000, function() {
  console.log('Server is starting on port 5000');
});

export {
  app,
  server,
}
