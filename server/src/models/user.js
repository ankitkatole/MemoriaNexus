const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    }
},
{
    timestamps : true
});

const User = mongoose.model('user', userSchema);
module.exports = {User};