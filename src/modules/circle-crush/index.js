import socketIO        from 'socket.io';
import { performance } from 'perf_hooks';
import collision       from '../../utils/collision';
import config          from '../../configs/circle-crush';
import randomInt       from '../../utils/randomInt';
import createBarricade from '../../utils/createBarricade';

const players = {};
const score = {};
const bullets = [];
const barricades = [];
const gameId = Math.random().toString(16).slice(2);

const init = (server) => {
  const io = socketIO(server);

  while (barricades.length < config.barricades.count) {
    barricades.push(createBarricade());
  }

  io.on('connection', (socket) => {
    socket.on('playerConnect', (playerName) => {
      console.log('Player connected: ', playerName);

      playerStart(playerName, socket.id, true);
    });

    socket.on('playerReconnect', (playerName, playerGameId) => {
      console.log('Player reconnected: ', playerName);

      playerStart(playerName, socket.id, !(playerGameId === gameId));
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

      let speed = config.playerSpeed + player.playerSpeedBonus;

      if (moveDiagonally) {
        speed = Math.sqrt(speed ** 2 - (Math.sqrt(2 * speed ** 2) / 2) ** 2);
      }

      if (movement.left) {
        const barricade = playerCollisionWithBarricade({
          x: player.x - speed,
          y: player.y,
        });

        if (barricade) {
          player.x = barricade.pos.x + barricade.size.width + config.playerSize + 1;
        } else {
          player.x -= speed;
          player.x = Math.max(player.x, 0);
        }
      }

      if (movement.up) {
        const barricade = playerCollisionWithBarricade({
          x: player.x,
          y: player.y - speed,
        });

        if (barricade) {
          player.y = barricade.pos.y + barricade.size.height + config.playerSize + 1;
        } else {
          player.y -= speed;
          player.y = Math.max(player.y, 0);
        }
      }

      if (movement.right) {
        const barricade = playerCollisionWithBarricade({
          x: player.x + speed,
          y: player.y,
        });

        if (barricade) {
          player.x = barricade.pos.x - config.playerSize - 1;
        } else {
          player.x += speed;
          player.x = Math.min(player.x, config.fieldSize.width);
        }
      }

      if (movement.down) {
        const barricade = playerCollisionWithBarricade({
          x: player.x,
          y: player.y + speed,
        });

        if (barricade) {
          player.y = barricade.pos.y - config.playerSize - 1;
        } else {
          player.y += speed;
          player.y = Math.min(player.y, config.fieldSize.height);
        }
      }
    });

    socket.on('shoot', (bullet) => {
      bullets.push(bullet);
    });

    socket.on('disconnect', () => {
      const playersData = Object.entries(players);
      const playerData = playersData.find(
        ([name, player]) => player.id === socket.id
      );

      if (!playerData) {
        return;
      }

      const [name, player] = playerData;
      console.log('disconnected! ', name);

      player.active = false;
      sendScore();
    });
  });

  const playerStart = (name, id, isImmune) => {
    players[name] = players[name] || {
      x: randomInt(0, config.fieldSize.width),
      y: randomInt(0, config.fieldSize.height),
      shootSpeedBonus: 0,
      playerSpeedBonus: 0,
    };

    players[name].active = true;
    players[name].id = id;
    players[name].connectTime = performance.now();
    players[name].isImmune = isImmune;
    score[name] = score[name] || 0;

    sendScore();
    sendBarricades();
  };

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
    io.sockets.emit('score', filterScore(), gameId);
  };

  const sendBarricades = () => {
    io.sockets.emit('barricades', barricades);
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

  const playerCollisionWithBarricade = (pos) => {
    for (let barricadeIndex = 0; barricadeIndex < barricades.length;) {
      const playerCollision = collision.test.rectCircle(
        barricades[barricadeIndex],
        {
          pos,
          size: config.playerSize,
        },
      );

      if (playerCollision) {
        return barricades[barricadeIndex];
      } else {
        barricadeIndex++;
      }
    }

    return false
  };

  const playerCollisionWithBullet = (player) => {

  };

  const bulletCollisionWithBarricade = (bullet) => {

  };

  const checkCollision = () => {
    Object.entries(filteredPlayers()).forEach(([name, player]) => {
      if (performance.now() - player.connectTime < config.playerInvulnerabilityTime) {
        return;
      }

      let collideWithBullet = false;
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

        if (name !== bullets[i].who && testPlayerCollision) {
          collideWithBullet = true;
          who = bullets[i].who;
          bullets.splice(i, 1);
        } else {
          i++;
        }
      }

      if (name !== who && collideWithBullet) {
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

    for (let i = 0; i < bullets.length;) {
      let collideWithBarricade = false;

      barricades.forEach((barricade) => {
        const testCollision = collision.test.rectRect(
          {
            pos: bullets[i].pos,
            size: {
              width: config.bulletSize,
              height: config.bulletSize,
            },
          },
          barricade,
        );

        if (testCollision) {
          collideWithBarricade = true;
        }
      });

      if (collideWithBarricade) {
        bullets.splice(i, 1);
      } else {
        i++;
      }
    }
  };

  const checkImmunity = () => {
    const now = performance.now();
    for (let playerName in players) {
      if (!players.hasOwnProperty(playerName)) {
        continue;
      }

      if (!players[playerName].active || !players[playerName].isImmune) {
        continue;
      }

      players[playerName].isImmune = now - players[playerName].connectTime < config.playerInvulnerabilityTime;
    }
  };

  setInterval(function () {
    clearBulletsList();
    checkImmunity();
    checkCollision();

    io.sockets.emit('state', {
      bullets,
      players: filteredPlayers(),
    });
  }, 1000 / 60);
};

module.exports = init;
