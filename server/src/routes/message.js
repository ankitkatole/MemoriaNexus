const {getInbox, getChat, sendMessage} = require("../controllers/message");
const { Router } = require("express");
const messageRouter = Router();

messageRouter.post("/inbox", getInbox);

messageRouter.post("/chats", getChat)

messageRouter.post('/chat/send', sendMessage)

module.exports = {
    messageRouter
}