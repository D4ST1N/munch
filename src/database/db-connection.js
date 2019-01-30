import mongoose from 'mongoose';
import { user } from './schemas/User.schema';

mongoose.connect(`mongodb://kitten:Parimatch27@ds111765.mlab.com:11765/kittens-db`, (err) => {

    if (err) throw err;

    console.log('Successfully connected');

});

const UserModel = mongoose.model('User', user);

export default UserModel;