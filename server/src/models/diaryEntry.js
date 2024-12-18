const mongoose = require('mongoose');

const DiaryEntrySchema = new Schema({
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
    },
    privacy_setting: {
        type: String,
        enum: ['private', 'shared', 'public'],
        default: 'private'
    }
}, { timestamps: true });

const DiaryEntry = mongoose.model('DiaryEntry', DiaryEntrySchema);

module.exports = { DiaryEntry };