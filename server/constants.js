require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const SECRET_KEY_USER = process.env.SECRET_KEY_USER;
const APP_EMAIL = process.env.APP_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;
const APP_NAME = process.env.APP_NAME;
const GENAI_KEY = process.env.GENAI_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const USERNAME_URL = process.env.USERNAME_URL;

module.exports = {
    PORT,DB_URL,SECRET_KEY_USER,APP_EMAIL,APP_PASSWORD,APP_NAME,GENAI_KEY,FRONTEND_URL,USERNAME_URL
};