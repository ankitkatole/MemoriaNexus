const Forum = require('../models/forum');

const createForum = async (req, res) => {
  const { name, category, members} = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required.' });
  }

  try {
    const newForum = new Forum({
      name,
      category,
      members: members, 
      chats: []     
    });

    await newForum.save();

    res.status(201).json(newForum);
  } catch (error) {
    console.error('Error creating forum:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createForum };
