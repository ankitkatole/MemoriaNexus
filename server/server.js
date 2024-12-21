const express = require('express');
const cors = require('cors');
const {createServer} = require('http')
const {Server} = require('socket.io')

const {PORT,FRONTEND_URL} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const {userRouter} = require('./src/routes/user');
const {messageRouter} = require("./src/routes/message");
const Forum = require('./src/models/forum');  
const forumRouter = require("./src/routes/forum");
const {horizonRouter} = require("./src/routes/horizon");

if (require.main === module) {

    // Database connection
    ConnectDB();
    
    const app = express();
    app.use(express.json()); 

    // cors
    app.use(cors({origin : true}));

    //This cors for development purpose
    // app.use(cors({
    //     origin: FRONTEND_URL,  
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    //     allowedHeaders: ['Content-Type', 'Authorization'], 
    //   }));

    // socket.io server
    const server = createServer(app)
    const io = new Server(server, {
        cors : {
            origin : true
        }
    })

    // Maintain a list of online users
    let onlineUsers = {};

    io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // When a user joins a forum
    socket.on('joinForum', ({ forumId, userId }) => {
        socket.join(forumId);

        // Add user to onlineUsers list
        if (!onlineUsers[forumId]) {
        onlineUsers[forumId] = [];
        }
        if (!onlineUsers[forumId].includes(userId)) {
        onlineUsers[forumId].push(userId);
        }

        // Emit the updated list of online users to the forum
        io.to(forumId).emit('onlineUsers', onlineUsers[forumId]);
    });

    // When a user sends a message
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
        for (let forumId in onlineUsers) {
        onlineUsers[forumId] = onlineUsers[forumId].filter(id => id !== socket.userId);
        io.to(forumId).emit('onlineUsers', onlineUsers[forumId]);
        }
    });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });

    // Routes
    
    app.use("/user",userRouter);
    app.use("/message", messageRouter);
    app.use("/forum", forumRouter);
    app.use("/horizon",horizonRouter)
}
