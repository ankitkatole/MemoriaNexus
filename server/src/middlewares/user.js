const { SECRET_KEY_USER } = require("../../constants")
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const auth = req.headers.authorization
    if(!auth){
        return res.status(401).json({
            messsage:"Authentication token not found"
        });
    }
    const token = auth.split(" ")[1];
    try{
        const decoded = jwt.verify(token, SECRET_KEY_USER);
            req.userId = decoded.id;
            next();
    }catch (e){
        return res.status(403).json({
            message: "invalid token"
        });
    }
}

module.exports = {
    userMiddleware
}