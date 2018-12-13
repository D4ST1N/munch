import socketIO from 'socket.io';
import collision from '../utils/collision';
import config from '../configs/circle-crush';
import randomInt from '../utils/randomInt';

const players = {};
const score = {};
const bullets = [];

const init = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    socket.on('playerConnect', (playerId) => {
      console.log('Player connected: ', playerId);

      players[playerId] = players[playerId] || {
        x: randomInt(0, config.fieldSize.width),
        y: randomInt(0, config.fieldSize.height),
        shootSpeedBonus: 0,
        playerSpeedBonus: 0,
      };

      players[playerId].active = true;
      players[playerId].id = socket.id;
      score[playerId] = score[playerId] || 0;

      sendScore();
    });

    socket.on('changePlayerName', ({ name, oldName }) => {
      players[name] = Object.assign({}, players[oldName]);
      score[name] = score[oldName];

      delete players[oldName];
      delete score[oldName];

      sendScore();
    });

    socket.on('movement', ({ id, movement }) => {
      if (!id || !movement) return;

      const player = players[id] || {};
      const moveDiagonally = movement.left && movement.up
        || movement.left && movement.down
        || movement.right && movement.up
        || movement.right && movement.down;

      let speed = config.playerSpeed;

      if (moveDiagonally) {
        speed = Math.sqrt(
          config.playerSpeed ** 2 - (Math.sqrt(2 * config.playerSpeed ** 2) / 2) ** 2
        );
      }

      if (movement.left) {
        player.x -= (speed + player.playerSpeedBonus);
        player.x = Math.max(player.x, 0);
      }

      if (movement.up) {
        player.y -= (speed + player.playerSpeedBonus);
        player.y = Math.max(player.y, 0);
      }

      if (movement.right) {
        player.x += (speed + player.playerSpeedBonus);
        player.x = Math.min(player.x, config.fieldSize.width);
      }

      if (movement.down) {
        player.y += (speed + player.playerSpeedBonus);
        player.y = Math.min(player.y, config.fieldSize.height);
      }
    });

    socket.on('shoot', (bullet) => {
      bullets.push(bullet);
    });

    socket.on('disconnect', () => {
      if (players.length === 0) {
        return;
      }

      const [name, player] = Object.entries(players).find(
        ([name, player]) => player.id === socket.id
      );
      console.log('disconnected! ', name);

      player.active = false;
      sendScore();
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

  const filterScore = () => (
    Object.entries(players)
          .filter(([id, player]) => player.active)
          .reduce((obj, [id]) => {
            obj[id] = score[id];
            return obj;
          }, {})
  );

  const sendScore = () => {
    io.sockets.emit('score', filterScore());
  };

  const clearBulletsList = () => {
    if (bullets.length === 0) {
      return;
    }

    let i = bullets.length - 1;

    while (i >= 0) {
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
    Object.entries(filteredPlayers()).forEach(([name, player]) => {
      let result = false;
      let who = '';

      for (let i = 0; i < bullets.length;) {
        const testPlayerCollision = collision.test.rectCircle(
          {
            pos: bullets[i].pos,
            size: config.bulletSize
          }, {
            pos: {
              x: player.x,
              y: player.y
            },
            size: config.playerSize
          }
        );

        if (testPlayerCollision) {
          result = true;
          who = bullets[i].who;
          bullets.splice(i, 1);
        } else {
          i++;
        }
      }

      if (result) {
        console.log('shooted!');
        io.sockets.emit('message', {
          who,
          type: 'frag',
          whom: name,
        });
        players[who].shootSpeedBonus += config.playerShootSpeedBonusPerKill;
        players[who].playerSpeedBonus += config.playerSpeedBonusPerKill;
        player.active = false;
        score[who] += 1;
        sendScore();
      }
    });
  };

  setInterval(function () {
    clearBulletsList();
    checkCollision();

    io.sockets.emit('state', {
      bullets,
      players: filteredPlayers(),
    });
  }, 1000 / 60);
};

module.exports = init;
