const mongoose = require('mongoose');

const MemoryVaultSchema = new Schema({
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
    media_url: {
        type: String,
        required: true
    },
    privacy_setting: {
        type: String,
        enum: ['private', 'shared', 'public'],
        default: 'private'
    }
}, { timestamps: true });

const MemoryVault = mongoose.model('MemoryVault', MemoryVaultSchema);


module.exports = { MemoryVault };