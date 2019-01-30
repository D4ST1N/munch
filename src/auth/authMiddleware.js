import JWT from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const jwtToken = req.cookies['authorization'];

    if (!jwtToken) {
        return res
            .status(401)
            .send({
                status: 'Unauthorized',
                error: {
                    message: 'Missing token'
                }
            })
    }

    const token = jwtToken.split(' ')[1];

    JWT.verify(token, 'JWTSecretAccess', (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .send({
                    status: 'Unauthorized',
                    error: {
                        message: 'Failed to authenticate token'
                    }
                })
        }

        req.jwtDecoded = decoded;

        if ((Date.now() - decoded.exp) <= 1000 * 60 * 60 * 5) {
            const newToken = JWT.sign({id: decoded.id, name: decoded.name, email: decoded.email}, 'JWTSecretAccess', {
                expiresIn: 60 * 60 * 24 * 2
            });

            req.session.username = decoded.name;
            req.session.token = newToken;

            res.cookie('authorization', `JWT ${newToken}`, {
                maxAge: 1000 * 60 * 60 * 24 * 2,
                httpOnly: true
            })
        }

        next();
    });
};

export default authMiddleware;