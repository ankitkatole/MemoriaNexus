const {createForum, getForumUsingUserId, getAllForumNames,getForumChatHistory,sendForumMessage,getForumById,joinForum} = require("../controllers/forum");
const { Router } = require("express");
const router = Router();

router.post("/createForum", createForum);

// returs all the forum in which user is present
router.get("/getForumUsingUserId/:userId", getForumUsingUserId);

router.get("/getAllForumNames", getAllForumNames)
router.get('/:forumId/chats', getForumChatHistory);
router.post('/:forumId/chats', sendForumMessage);
router.get('/:forumId', getForumById);
router.post('/join/:forumId', joinForum);

module.exports = router;
