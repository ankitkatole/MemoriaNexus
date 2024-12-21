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

const getForumUsingUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const forums = await Forum.find({ members: userId });

        if (!forums.length) {
            return res.status(404).json({ message: 'No forums found for this user.' });
        }

        res.status(200).json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllForumNames = async (req, res) => {
    try {
        const forums = await Forum.find({}, 'name category');

        if (!forums.length) {
            return res.status(404).json({ message: 'No forums found.' });
        }

        res.status(200).json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createForum, getForumUsingUserId , getAllForumNames};
