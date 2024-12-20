const {model} = require('../utils/horizonBot');

const horizonBot = async (req, res) => {
    const { userInput } = req.body;
    try {
        console.log(userInput)
        const r = await model.generateContent(userInput);
        const op = r.response.text();
        console.log(op)
        res.json({ output: op });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
};

module.exports = {horizonBot};