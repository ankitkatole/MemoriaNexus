const { sendEmail } = require("../utils/email");
const { SECRET_KEY_USER, APP_EMAIL } = require("../../constants");
const {TimeCapsule} = require("../models/timeCapsule");
const { User } = require("../models/user");

const uploadTimeCapsule = async(req, res) => {
    try{
        const {userId} = req.userId;
        const {title,description,geo_tag,unlock_date} = req.body;
        const image = req.file.filename;
        const timeCapsule = new TimeCapsule({
            user_id: userId,
            title,
            description,
            geo_tag,
            image,
            unlock_date
        });
        await timeCapsule.save();
        res.status(201).json(timeCapsule);
    }catch(error){
        console.log("Error in uploadTimeCapsule controller: ",error);
        res.status(500).json({
            message: error.message
        });
    }
}

const unlockTimeCapsule = async(req, res) => {
    try{
        const {userId} = req.userId;
        const {timeCapsuleId} = req.params;
        const timeCapsule = await TimeCapsule.findById(timeCapsuleId);
        if(!timeCapsule){
            return res.status(404).json({
                message: "TimeCapsule not found"
            });
        }
        if(timeCapsule.user_id.toString() !== userId){
            return res.status(403).json({
                message: "You are not authorized to unlock this timeCapsule"
            });
        }
        const unlockDate = timeCapsule.unlock_date;
        const currentDate = new Date();
        if(currentDate >= unlockDate){
            return res.status(400).json({    
                message: "TimeCapsule is already unlocked"
            });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json(timeCapsule);
    }catch(error){
        console.log("Error in unlockTimeCapsule controller: ",error);
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    uploadTimeCapsule,
    unlockTimeCapsule
}