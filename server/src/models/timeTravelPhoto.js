const mongoose = require('mongoose');

const TimeTravelPhotoSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    geo_tag: {
        type: String,
        required: true
    },
    media_url: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TimeTravelPhoto = mongoose.model('TimeTravelPhoto', TimeTravelPhotoSchema);

module.exports = { TimeTravelPhoto };