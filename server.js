import express          from 'express';
import http             from 'http';
import path             from 'path';
import fs               from 'fs';
import {
  createLogger,
  format,
  transports
}                       from 'winston';
import morgan           from 'morgan';
import bodyParser       from 'body-parser';
import cookieParser     from 'cookie-parser';
import session          from 'express-session';
import authMiddleware   from './src/auth/authMiddleware';
import circleCrush      from './src/modules/circle-crush';
import explodingKittens from './src/modules/exploding-kittens';
import getProfile       from "./src/auth/getProfile";
import userLogin        from "./src/auth/userLogin";
import registerUser     from "./src/auth/registerUser";

const { combine, printf } = format;
const { Console, File } = transports;
const app = express();
const server = http.Server(app);

const logFormat = printf(info => {
  return `${new Date()}: [${info.level}]: ${info.message}`;
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'secret_for_session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // domain: '.tat.com',
    path: '/',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 2,
    secure: false
  }
}));

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

app.use('/themes', express.static(__dirname + '/client/public/styles/themes'));

app.post('/user/login', userLogin);

app.post('/user/register', registerUser);

app.get('/user/profile', authMiddleware, getProfile);

app.use('/static', express.static(__dirname + '/client/dist'));

app.get('/circle-crush/config', (request, response) => {
  response.sendFile(path.join(__dirname, '/src/configs/circle-crush.json'));
});

app.get('/exploding-kittens/logs/:id', (request, response, next) => {
  const filePath = path.join(__dirname, `/logs/games/${request.params.id}.js`);

  fs.readFile(filePath, (err) => {
    if (err) {
      next(err);
    }

    response.sendFile(filePath);
  });
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
