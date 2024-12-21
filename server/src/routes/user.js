const {signup , signin,signout,forgotPassword,updatePassword,deleteAccount} = require("../controllers/user");
const {uploadTimeCapsule,unlockTimeCapsule,getTimeCapsules} = require("../controllers/timecapsule");
const {userMiddleware} = require("../middlewares/user");

const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/signout", signout);
userRouter.post("/forgotpassword",forgotPassword);
userRouter.post("/updatepassword",updatePassword);
userRouter.post("/uploadTimeCapsule",uploadTimeCapsule);
userRouter.post("/unlockTimeCapsule",unlockTimeCapsule);
userRouter.post("/timeCapsules",getTimeCapsules)
userRouter.delete('/deleteaccount',userMiddleware,deleteAccount);


module.exports = {
    userRouter
}