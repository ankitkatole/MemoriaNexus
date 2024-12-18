const express = require('express');
const {PORT} = require('./constants');

const app = express();


app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
