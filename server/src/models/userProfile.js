const mongoose = require('mongoose');
const { User } = require('./user');

const UserProfileSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personal_info: {
        type: String
    },
    contributions: {
        type: [Schema.Types.ObjectId],
        ref: 'DiaryEntry'
    },
    settings: {
        type: String
    }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);


module.exports = {
    UserProfile
}