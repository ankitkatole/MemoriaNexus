const {createForum} = require("../controllers/message");
const { Router } = require("express");
const forumRouter = Router();

forumRouter.post("/createForum", createForum);

module.exports = {
    forumRouter
}