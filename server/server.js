const express = require('express');
const cors = require('cors');
const {createServer} = require('http')
const {Server} = require('socket.io')

const {PORT} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const {userRouter} = require('./src/routes/user');

if (require.main === module) {

    // Database connection
    ConnectDB();
    
    const app = express();
    app.use(express.json()); 

    // cors
    app.use(cors({origin : true}));

    // socket.io server
    const server = createServer(app)
    const io = new Server(server, {
        cors : {
            origin : true
        }
    })

    io.on("connection",(socket)=>{
        console.log("User connected : ",socket.id)
    })

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });

    // Routes
    app.use("/user",userRouter);
}
