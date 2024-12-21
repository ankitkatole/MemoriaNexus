const express = require("express");
const {horizonBot} = require('../controllers/horizon');

const horizonRouter = express.Router();

horizonRouter.post("/",horizonBot);

module.exports = {horizonRouter};