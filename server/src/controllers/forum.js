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
        const forums = await Forum.find({}, 'name category members');

        if (!forums.length) {
            return res.status(404).json({ message: 'No forums found.' });
        }

        res.status(200).json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get chat history for a forum
const getForumChatHistory = async (req, res) => {
  const { forumId } = req.params;
  
  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    
    res.status(200).json(forum.chats);
  } catch (error) {
    console.error('Error getting forum chat history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send message to a forum (REST API endpoint as backup)
const sendForumMessage = async (req, res) => {
  const { forumId } = req.params;
  const { userId, message } = req.body;
  
  if (!userId || !message) {
    return res.status(400).json({ message: 'User ID and message are required' });
  }
  
  try {
    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    
    // Check if user is a member of the forum
    if (!forum.members.includes(userId)) {
      return res.status(403).json({ message: 'User is not a member of this forum' });
    }
    
    const newMessage = {
      userId,
      message,
      timestamp: Date.now()
    };
    
    forum.chats.push(newMessage);
    await forum.save();
    
    // Notify all users in the forum through socket.io
    req.app.get('io').to(forumId).emit('forumMessage', newMessage);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending forum message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getForumById = async (req, res) => {
  const { forumId } = req.params;

  if (!forumId) {
    return res.status(400).json({ message: 'Forum ID is required.' });
  }

  try {
    const forum = await Forum.findById(forumId);
    
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found.' });
    }

    res.status(200).json(forum);
  } catch (error) {
    console.error('Error fetching forum:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const joinForum = async (req, res) => {
  const { forumId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const forum = await Forum.findById(forumId);
    
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found.' });
    }

    // Check if user is already a member
    if (forum.members.includes(userId)) {
      return res.status(200).json({ message: 'User is already a member of this forum.' });
    }

    // Add user to members array
    forum.members.push(userId);
    await forum.save();

    res.status(200).json({ message: 'Successfully joined the forum.', forum });
  } catch (error) {
    console.error('Error joining forum:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createForum, getForumUsingUserId, getAllForumNames, getForumChatHistory, sendForumMessage, getForumById, joinForum };
