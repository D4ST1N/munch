import UserModel from "../database/db-connection";

const getProfile = (req, res, next) => {
    UserModel
        .findById(req.jwtDecoded.id)
        .then((user) => {
            return res
                .status(200)
                .send({
                    status: 'OK',
                    data: user
                })
        })
        .catch((error) => {
            const err = new Error(error);
            err.status = 400;
            return next(err);
        })
};

export default getProfile;