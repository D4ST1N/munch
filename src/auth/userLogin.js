import UserModel from "../database/db-connection";
import JWT from "jsonwebtoken";

const userLogin = (req, res, next) => {
    UserModel
        .findOne({ username: req.body.username }, '+password')
        .then(user => {
            if (!user) {
                return res.status(400).send({
                    error: 'NOTIFICATIONS.GAME.LOGIN_FAILED',
                });
            }

            const passwordValid = user.validPassword(req.body.password);

            if (!passwordValid) {
                const err = new Error('Invalid password');
                err.status = 400;
                return next(err);
            }

            const token = JWT.sign(
                {
                    id: user._id,
                    name: user.username,
                    email: user.email
                },
                'JWTSecretAccess',
                {
                    expiresIn: 60 * 60 * 24 * 2
                }
            );

            req.session.username = req.body.username;
            req.session.token = token;

            return res
                .cookie('authorization', `JWT ${token}`, {
                    maxAge: 1000 * 60 * 60 * 24 * 2,
                    httpOnly: true
                })
                .status(200)
                .send({
                    status: 'OK'
                })

        })
};

export default userLogin;
