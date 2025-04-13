const express = require('express');
const cors = require('cors');
const {createServer} = require('http');
const {Server} = require('socket.io');
const bodyParser = require('body-parser');

const {PORT, FRONTEND_URL} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const {userRouter} = require('./src/routes/user');
const {messageRouter} = require("./src/routes/message");
const Forum = require('./src/models/forum');  
const forumRouter = require("./src/routes/forum");
const {horizonRouter} = require("./src/routes/horizon");
const diaryRouter = require("./src/routes/diary.js");
const Inbox = require('./src/models/inbox');
const { User } = require('./src/models/user');

// Function to store messages (moved from controller)
const storeMessage = async (from, to, message) => {
    // Check if sender's inbox exists, create if not
    let userFrom = await Inbox.findOne({User: from});
    if (!userFrom) {
        userFrom = new Inbox({
            User: from,
            Messages: [],
            Recived: []
        });
    }

    const fromMessagesLength = userFrom.Messages.length;
    
    let i = 0;
    for(i = 0; i < fromMessagesLength; i++) {
        if(userFrom.Messages[i].to == to) {
            userFrom.Messages[i].data.push({
                mes: message,
                at: Date.now()
            });
            break;
        }
    }

    if(i == fromMessagesLength) {
        userFrom.Messages.push({
            to: to,
            data: [{
                mes: message,
                at: Date.now()
            }]
        });
    }

    await userFrom.save();

    // Check if receiver's inbox exists, create if not
    let userTo = await Inbox.findOne({User: to});
    if (!userTo) {
        userTo = new Inbox({
            User: to,
            Messages: [],
            Recived: []
        });
    }

    const toRecivedLength = userTo.Recived.length;
    
    i = 0;
    for(i = 0; i < toRecivedLength; i++) {
        if(userTo.Recived[i].from == from) {
            userTo.Recived[i].data.push({
                mes: message,
                at: Date.now()
            });
            break;
        }
    }

    if(i == toRecivedLength) {
        userTo.Recived.push({
            from: from,
            data: [{
                mes: message,
                at: Date.now()
            }]
        });
    }

    await userTo.save();
    return Date.now(); // Return the timestamp
};

if (require.main === module) {
    // Database connection
    ConnectDB();
    
    const app = express();
    app.use(express.json()); 

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // cors
    app.use(cors({origin: true}));

    // socket.io server
    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: true
        }
    });

    // Maintain a list of online users
    let onlineUsers = {};
    
    // Map of user emails to socket IDs for private chat
    let connectedChatUsers = {};

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        socket.on('joinForum', async ({ forumId, userId, username }) => {
            console.log(`User ${userId} (${username}) joined forum: ${forumId}`);
            socket.join(forumId);
          
            // Add user to online users list with username
            if (!onlineUsers[forumId]) {
              onlineUsers[forumId] = [];
            }
            
            // Remove user if already exists (in case of reconnection)
            onlineUsers[forumId] = onlineUsers[forumId].filter(user => user.userId !== userId);
            
            // Add user with username
            onlineUsers[forumId].push({ userId, username });
            
            try {
              // Fetch forum chat history and send it to the user
              const forum = await Forum.findById(forumId);
              if (forum) {
                socket.emit('forumChatHistory', forum.chats);
              }
              
              // Broadcast updated online users list to all users in the forum
              io.to(forumId).emit('forumOnlineUsers', onlineUsers[forumId]);
            } catch (error) {
              console.error('Error fetching forum data:', error);
              socket.emit('forumError', { message: 'Failed to load forum data' });
            }
          });
          // Handle forum message sending
socket.on('sendForumMessage', async ({ forumId, userId, message }) => {
    console.log(`Message in forum ${forumId} from ${userId}: ${message}`);
    
    try {
      const forum = await Forum.findById(forumId);
      if (!forum) {
        socket.emit('forumError', { message: 'Forum not found' });
        return;
      }
  
      const newMessage = {
        userId,
        message,
        timestamp: Date.now()
      };
      
      // Save message to the database
      forum.chats.push(newMessage);
      await forum.save();
      
      // Broadcast the message to all users in the forum
      io.to(forumId).emit('forumMessage', newMessage);
    } catch (error) {
      console.error('Error sending forum message:', error);
      socket.emit('forumError', { message: 'Failed to send message' });
    }
  });

  socket.on('forumTyping', ({ forumId, userId, username }) => {
    socket.to(forumId).emit('userForumTyping', { userId, username });
  });
  
  // Handle user stopped typing indicator for forums
  socket.on('forumStopTyping', ({ forumId, userId }) => {
    socket.to(forumId).emit('userForumStoppedTyping', { userId });
  });
  
  // When user leaves a forum
  socket.on('leaveForum', ({ forumId, userId }) => {
    console.log(`User ${userId} left forum: ${forumId}`);
    socket.leave(forumId);
    
    // Remove user from online users list
    if (onlineUsers[forumId]) {
      onlineUsers[forumId] = onlineUsers[forumId].filter(user => user.userId !== userId);
      io.to(forumId).emit('forumOnlineUsers', onlineUsers[forumId]);
    }
  });
  
  // Handle disconnection - add forum cleanup
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Handle removal from all forums
    for (let forumId in onlineUsers) {
      onlineUsers[forumId] = onlineUsers[forumId].filter(user => user.userId !== socket.userId);
      io.to(forumId).emit('forumOnlineUsers', onlineUsers[forumId]);
    }
  });

        // Chat authentication
        socket.on('authenticate', async (email) => {
            console.log(`User ${email} connected with socket ID: ${socket.id}`);
            
            // Store the mapping of email to socket ID
            connectedChatUsers[email] = socket.id;
            socket.userEmail = email;
            
            // Find user details
            try {
                const user = await User.findOne({email: email});
                if (user) {
                    // Emit user's online status to all connected users
                    io.emit('userStatus', { 
                        email: email, 
                        name: user.firstName + " " + user.lastName,
                        status: 'online' 
                    });
                }
            } catch (error) {
                console.error('Error finding user:', error);
            }
            
            // Send the current list of online users to the newly connected user
            const onlineUserEmails = Object.keys(connectedChatUsers);
            socket.emit('onlineUsersList', onlineUserEmails);
        });

        // Handle private message
        socket.on('sendPrivateMessage', async (data) => {
            const { from, to, message } = data;
            
            try {
                // Store message in database using the same logic as your controller
                const timestamp = await storeMessage(from, to, message);
                
                // Send confirmation to sender
                socket.emit('messageConfirmation', {
                    id: `my-${timestamp}`,
                    sender: "Me",
                    text: message,
                    time: "Just now",
                    timestamp: timestamp
                });
                
                // Send to recipient if online
                if (connectedChatUsers[to]) {
                    // Get sender's details for recipient
                    const senderUser = await User.findOne({email: from});
                    const senderName = senderUser ? 
                        senderUser.firstName + " " + senderUser.lastName : from;
                    
                    io.to(connectedChatUsers[to]).emit('newPrivateMessage', {
                        id: `other-${timestamp}`,
                        sender: senderName,
                        senderEmail: from,
                        text: message,
                        time: "Just now",
                        timestamp: timestamp
                    });
                }
            } catch (error) {
                console.error("Error sending private message:", error);
                socket.emit('messageError', { message: "Failed to send message" });
            }
        });

        // When a user joins a forum
        socket.on('joinForum', ({ forumId, userId, username }) => {
            console.log(`User ${userId} (${username}) joined forum: ${forumId}`);
            socket.join(forumId);

            // Add user to onlineUsers list
            if (!onlineUsers[forumId]) {
                onlineUsers[forumId] = [];
            }
            
            // Remove user if already exists (in case of reconnection)
            onlineUsers[forumId] = onlineUsers[forumId].filter(user => user.userId !== userId);
            
            // Add user with username
            onlineUsers[forumId].push({ userId, username });

            // Emit the updated list of online users to the forum
            io.to(forumId).emit('forumOnlineUsers', onlineUsers[forumId]);
        });

        // When a user sends a message to a forum
        socket.on('sendMessage', async (data) => {
            const { forumId, userId, message } = data;

            try {
                const forum = await Forum.findById(forumId);
                if (!forum) {
                    console.error('Forum not found');
                    return;
                }

                const newMessage = {
                    userId,
                    message,
                    timestamp: new Date()
                };
                forum.chats.push(newMessage);
                await forum.save();

                io.to(forumId).emit('receiveMessage', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            
            // Handle forum disconnect
            for (let forumId in onlineUsers) {
                onlineUsers[forumId] = onlineUsers[forumId].filter(id => id !== socket.userId);
                io.to(forumId).emit('onlineUsers', onlineUsers[forumId]);
            }
            
            // Handle chat disconnect
            if (socket.userEmail) {
                // Remove from connected users
                delete connectedChatUsers[socket.userEmail];
                
                // Broadcast offline status
                io.emit('userStatus', { 
                    email: socket.userEmail, 
                    status: 'offline' 
                });
            }
        });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });

    // Routes
    app.use("/user", userRouter);
    app.use("/message", messageRouter);
    app.use("/forum", forumRouter);
    app.use("/horizon", horizonRouter);
    app.use("/diary", diaryRouter);
}