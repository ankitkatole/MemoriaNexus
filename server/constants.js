require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const SECRET_KEY_USER = process.env.SECRET_KEY_USER;


module.exports = {
    PORT,DB_URL,SECRET_KEY_USER
};