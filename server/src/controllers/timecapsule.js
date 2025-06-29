const { TimeCapsule } = require("../models/timeCapsule");
const { User } = require("../models/user");

const uploadTimeCapsule = async (req, res) => {
    try {
        const { title, description, unlock_date, user_id } = req.body;
        const image = req.file.buffer;

        const timeCapsule = new TimeCapsule({
            user_id: user_id,
            title,
            description,
            image,
            unlock_date
        });

        await timeCapsule.save();

        res.status(201).json(timeCapsule);
    } catch (error) {
        console.log("Error in uploadTimeCapsule controller: ", error);
        res.status(500).json({
            message: error.message
        });
    }
}

const unlockTimeCapsule = async (req, res) => {
    try {
        const { userId, timeCapsuleId } = req.body;

        // Find the user by username
        const user = await User.findOne({username:userId});
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                

            });
        }
        

        // Find the Time Capsule by ID
        const timeCapsule = await TimeCapsule.findById(timeCapsuleId);
        if (!timeCapsule) {
            return res.status(404).json({
                message: "TimeCapsule not found"
            });
        }

        // Check if the user is authorized
        if (timeCapsule.user_id !== userId) {
            return res.status(403).json({
                message: "You are not authorized to unlock this time capsule",
                
            });
        }

        // Check unlock date
        const unlockDate = new Date(timeCapsule.unlock_date);
        const currentDate = new Date();
        if (currentDate < unlockDate) {
            const formattedUnlockDate = unlockDate.toDateString();
            return res.status(200).json({
                message: `TimeCapsule is yet to unlock. Please wait until ${formattedUnlockDate}.`
            });
        }

        // Convert image to Base64
        const base64Image = timeCapsule.image.toString('base64');

        // Respond with unlocked Time Capsule
        res.status(200).json({
            message: "TimeCapsule unlocked successfully!",
            timeCapsule: {
                ...timeCapsule._doc,
                image: base64Image
            }
        });
    } catch (error) {
        console.error("Error in unlockTimeCapsule controller: ", error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getTimeCapsules = async (req, res) => {
    try {
        const { userId } = req.body;
        const timeCapsules = await TimeCapsule.find({ user_id: userId });

        if (!timeCapsules.length) {
            return res.status(404).json({
                message: "You don't have any time capsules yet."
            });
        }
        res.status(200).json({
            message: "Time Capsules fetched successfully",
            timeCapsules
        });
    } catch (error) {
        console.log("Error in getTimeCapsules controller: ", error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    uploadTimeCapsule,
    unlockTimeCapsule,
    getTimeCapsules
}