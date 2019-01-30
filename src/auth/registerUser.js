import UserModel from "../database/db-connection";
import JWT from 'jsonwebtoken';
import bcrypt from "bcrypt";

const registerUser = (req, res, next) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    };

    UserModel
        .findOne({username: newUser.username}, (error, user) => {
            if (error) {
                const err = new Error(error);
                err.status = 400;
                return next(err);
            }

            if (user) {
                const err = new Error('Username is exists');
                err.status = 400;
                return next(err);
            }

            newUser.password = bcrypt.hashSync(newUser.password, 10, null);

            UserModel.create(newUser, (err, createdUser) => {
                if (err) {
                    const error = new Error(err);
                    error.status = 400;
                    return next(error);
                }

                const token = JWT.sign({ id: createdUser._id, name: createdUser.username, email: createdUser.email }, 'JWTSecretAccess', {
                    expiresIn: 60 * 60 * 24 * 2
                });

                req.session.username = createdUser.username;
                req.session.token = token;

                return res
                    .cookie('authorization', `JWT ${token}`, {
                        maxAge: 1000 * 60 * 60 * 24 * 2,
                        httpOnly: true
                    })
                    .status(201).send({
                        status: 'Created'
                    })
            });
        });
};

export default registerUser;