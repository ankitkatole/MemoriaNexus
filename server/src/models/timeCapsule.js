const {mongoose, Schema} = require('mongoose');

const TimeCapsuleSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
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
    image: {
        type: Buffer,
        required: true
    },
    unlock_date: {
        type: Date,
        required: true
    },
}, { timestamps: true });

const TimeCapsule = mongoose.model('TimeCapsule', TimeCapsuleSchema);

module.exports = { TimeCapsule };