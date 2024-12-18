const express = require('express');
const cors = require('cors');

const {PORT} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const {userRouter} = require('./src/routes/user');

const app = express();

app.use(express.json()); 
app.use(cors());

ConnectDB();

app.use("/user",userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
