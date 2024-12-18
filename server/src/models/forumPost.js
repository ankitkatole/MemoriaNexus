const mongoose = require('mongoose');

const ForumPostSchema = new Schema({
    forum_id: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', ForumPostSchema);

module.exports = { ForumPost };