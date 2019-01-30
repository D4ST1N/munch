import JWT from 'jsonwebtoken';
import cookieParser from "../utils/cookieParser";

const socketAuthMiddleware = (socket, next) => {
    const cookie = socket.handshake.headers.cookie;
    const jwtToken = cookieParser(cookie,'authorization');

    if (!jwtToken) {
        socket.disconnect(true);
        return;
    }

    const token = jwtToken.split('%20')[1];

    JWT.verify(token, 'JWTSecretAccess', (err, decoded) => {
        if (err) {
            socket.disconnect(true);
            return;
        }

        socket.jwtDecoded = decoded;

        next();
    });
};

export default socketAuthMiddleware;