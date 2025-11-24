const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,       
        required: true,
    },
});

UserSchema.plugin(passportlocalMongoose); // adds username, hash and salt fields

module.exports = mongoose.model('User', UserSchema);