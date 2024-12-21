const {signup , signin,signout,forgotPassword,updatePassword} = require("../controllers/user");
const {uploadTimeCapsule,unlockTimeCapsule} = require("../controllers/timecapsule");
const {userMiddleware} = require("../middlewares/user");

const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/signout", signout);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.post("/updatepassword",updatePassword);
userRouter.post("/uploadTimeCapsule",userMiddleware,uploadTimeCapsule);
userRouter.post("/unlockTimeCapsule/:timeCapsuleId",userMiddleware,unlockTimeCapsule);

module.exports = {
    userRouter
}