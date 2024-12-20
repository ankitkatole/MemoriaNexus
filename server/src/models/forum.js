const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  members: {
    type: [String],
    default: [],
  },
  chats: {
    type: [{
      user: { type: String},
      message: { type: String},
      timestamp: { type: Date, default: Date.now }
    }],
    default: []
  }
});

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;
