const {signup , signin,signout} = require("../controllers/user");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin)
userRouter.post("/signout", signout)

module.exports = {
    userRouter
}