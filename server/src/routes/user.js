const {signup , signin,signout,forgotPassword,updatePassword} = require("../controllers/user");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", signup);

userRouter.post("/signin", signin)
userRouter.post("/signout", signout)
userRouter.post("/forgotpassword",forgotPassword)
userRouter.post("/updatepassword",updatePassword)

module.exports = {
    userRouter
}