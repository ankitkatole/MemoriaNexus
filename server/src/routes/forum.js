const {createForum, getForumUsingUserId} = require("../controllers/forum");
const { Router } = require("express");
const router = Router();

router.post("/createForum", createForum);

// returs all the forum in which user is present
router.get("/getForumUsingUserId/:userId", getForumUsingUserId);

module.exports = router;
