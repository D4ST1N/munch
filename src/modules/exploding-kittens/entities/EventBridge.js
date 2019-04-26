import Rooms   from './Rooms';
import getRoom from '../helpers/getRoom';
import gameUpdate from '../helpers/gameUpdate';

export default class EventBridge {
  constructor(io) {
    this.events = {};
    this.io = io;

    io.on('connection', (socket) => {
      console.log('new connection', socket.id);
      // socket.emit('roomList', Rooms);

      socket.onpacket = (pack) => {
        const [event, payload] = pack.data;
        let room;
        console.log('new event emit', event, payload);

        if (payload && payload.roomId) {
          room = getRoom(Rooms, payload.roomId);

          if (!room) {
            socket.emit('roomStatus', { exist: false });

            return;
          }
        }

        this.dispatch(event, socket, { room, ...payload });
      };

      socket.on('disconnect', () => {
        console.log('disconnecting...', socket.id);
        // TODO work out disconnecting. Show message make player not active;
      });
    });
  }

  get activeSockets() {
    return this.io.sockets.connected;
  }

  on(event, fn) {
    let listeners = this.events[event];

    if (!listeners) {
      this.events[event] = listeners = [];
    }

    listeners.push(fn);
  }

  emit(id, event, payload) {
    this.io.to(id).emit(event, payload);
  }

  emitAll(event, payload) {
    this.io.emit(event, payload);
  }

  broadcast(socket, event, payload) {
    socket.broadcast.emit(event, payload);
  }

  off(event, fn) {
    let listeners = this.events[event];

    if (!fn) {
      this.events[event] = [];

      return;
    }

    const index = listeners.indexOf(fn);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  dispatch(event, socket, payload) {
    const listeners = this.events[event];

    if (listeners) {
      listeners.forEach((listener) => {
        listener(socket, payload);
      });
    }
  }

  getSocket(socketId) {
    return this.activeSockets[socketId];
  }
}
