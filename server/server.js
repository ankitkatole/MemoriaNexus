const express = require('express');
const cors = require('cors');
const {createServer} = require('http')
const {Server} = require('socket.io')

const {PORT} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const {userRouter} = require('./src/routes/user');
const {messageRouter} = require("./src/routes/message");
const {horizonRouter} = require("./src/routes/horizon");

if (require.main === module) {

    // Database connection
    ConnectDB();
    
    const app = express();
    app.use(express.json()); 

    // cors
    // app.use(cors({origin : true}));
    app.use(cors({
        origin: 'https://memoria-nexus.vercel.app',  // Adjust this for your front-end URL
        methods: ['GET', 'POST'],  // Allow these methods
        allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
      }));

    // socket.io server
    const server = createServer(app)
    const io = new Server(server, {
        cors : {
            origin : true
        }
    })
    //mapping
    const emailToSocketIdMap = new Map()

    io.on("connection",(socket)=>{
        console.log("User connected : ",socket.id)
    
        socket.on("user:connected",async (data)=>{
            if(data.email){
                emailToSocketIdMap.set(data.email, socket.id)
                console.log("new map inserted")
            }
        })
    
        socket.on("user:message", async(data)=>{
            if(data.to){
                let reciverSocketID = emailToSocketIdMap.get(data.to)
                console.log(data.from,data.to,data.message)
                console.log("reciver socket.id : ",reciverSocketID)
                io.to(reciverSocketID).emit("user:message",{mes : data.message, at : Date.now()})
            }
        })
    
        socket.on("disconnect", async()=>{
            
            for (const [key, value] of emailToSocketIdMap.entries()) {
                if (value === socket.id) {
                    emailToSocketIdMap.delete(key)
                }
            }
            console.log("map deleted")  
        })
    })

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });

    // Routes
    app.use("/user",userRouter);
    app.use("/message", messageRouter);
    app.use("/horizon",horizonRouter)
}
