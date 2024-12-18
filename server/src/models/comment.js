const mongoose = require('mongoose');

const CommentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    related_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['diary', 'memory', 'chapter'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment };