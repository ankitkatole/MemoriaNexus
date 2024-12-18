const mongoose = require('mongoose');

const GlobalStorybookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const GlobalStorybook = mongoose.model('GlobalStorybook', GlobalStorybookSchema);


module.exports = { GlobalStorybook };