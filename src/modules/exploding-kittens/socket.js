import socketIO   from 'socket.io';
import { server } from '../../../server';

export default function (path) {
  return socketIO(server, { path });
};
