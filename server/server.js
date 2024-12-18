const express = require('express');
const {PORT} = require('./constants');
const {ConnectDB} = require('./src/db/connection');
const app = express();

app.use(express.json()); 

ConnectDB();

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
