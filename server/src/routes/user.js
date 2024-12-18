const {signup , signin} = require("../controllers/user");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin)

module.exports = {
    userRouter
}