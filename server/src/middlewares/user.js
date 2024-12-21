const { SECRET_KEY_USER } = require("../../constants")
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({
            message: "Authentication token not found"
        });
    }

    const token = auth.split(" ")[1];
    if (!token) {
        return res.status(400).json({
            message: "Token format is incorrect"
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY_USER);
        req.userId = decoded.id;
        next();
    } catch (e) {
        console.error("Error in user middleware:", e); 
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}


module.exports = {
    userMiddleware
}