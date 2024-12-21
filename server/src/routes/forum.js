const {createForum} = require("../controllers/forum");
const { Router } = require("express");
const router = Router();

router.post("/createForum", createForum);

module.exports = router;
