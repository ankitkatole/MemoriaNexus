// const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { SECRET_KEY_USER } = require("../../constants")
const { User } = require("../models/user");

const signup = async (req, res) =>  {
    // const requiredBody = z.object({
    //     firstName: z.string(),
    //     lastName: z.string(),
    //     email: z.string().email(),
    //     password: z.string().min(8),
    // });

    // const parsedBodyWithSuccess = requiredBody.safeParse(req.body);

    // if (!parsedBodyWithSuccess.success) {
    //     const errorMessages = parsedBodyWithSuccess.error.errors.map(err => err.message);
    //     console.log(parsedBodyWithSuccess.error.errors);
    //     return res.status(400).json({
    //         message: errorMessages,
    //         errors: parsedBodyWithSuccess.error.errors,
    //     });
    // }
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: email,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "You are successfully signed up",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error Signing Up",
            error: error.message || "Something went wrong",
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).json({
                message: "Invalid Credentials"
            });
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY_USER);
        res.json({
            message: "You are signed in",
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {signup, signin};
