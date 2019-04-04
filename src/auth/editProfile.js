import UserModel from "../database/db-connection";

const editProfile = (req, res, next) => {
    const reqData = [ 'gender', 'email', 'avatar' ];
    const correctData = Object.keys(req.body).filter(item => reqData.includes(item));
    let newData = {};

    correctData.forEach(item => {
       newData = { ...newData, [item]: req.body[item] };
    });

    UserModel
        .findOneAndUpdate(req.jwtDecoded.id, newData, { new: true })
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

export default editProfile;