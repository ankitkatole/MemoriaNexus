const mongoose = require('mongoose');

const ForumSchema = new Schema({
    category: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Forum = mongoose.model('Forum', ForumSchema);

module.exports = { Forum };