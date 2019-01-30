import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const {
    ObjectId
} = Schema.Types;

export const user = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: 1,
    },
    email: {
        type: String,
        validate: {
            validator: (email) => {
                const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return re.test(String(email).toLowerCase());
            },
            message: 'Email is not valid.'
        },
        index: 1,
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {
    collection: 'Users'
});

// generating a hash
user.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 10, null);
};

// checking if password is valid
user.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};