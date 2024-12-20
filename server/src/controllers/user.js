// const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { sendEmail } = require("../utils/email");
const { generateOTP } = require("../utils/helper")
const { SECRET_KEY_USER, APP_EMAIL } = require("../../constants")
const { User } = require("../models/user");

const signup = async (req, res) => {
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
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
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
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY_USER, { expiresIn: "24h" });
        console.log("here tk aa gaya", token)
        const subject = `Welcome to Memoria Nexus, ${firstName} ${lastName}!`;

        const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <h1>Hi ${firstName} ${lastName},</h1>
                    <p>We're thrilled to welcome you to the Memoria Nexus community!</p>
                    <h2>About Memoria Nexus</h2>
                    <p>Memoria Nexus is your all-in-one platform for logging diaries, preserving memories, and sharing stories across generations. We believe that every moment, big or small, deserves to be remembered and cherished.</p>
                    <h2>Why "Memoria Nexus"?</h2>
                    <p>We chose the name "Memoria Nexus" because it perfectly captures our mission. "Memoria" stands for memories, and "Nexus" means a connection or link. Together, it signifies our goal to connect people through their shared experiences and precious memories.</p>
                    <h2>What Makes Us Different?</h2>
                    <p>Unlike common diary apps or discussion platforms, Memoria Nexus integrates diary logging, memory storage, empathy exchange, collaborative storytelling, and historical photo archiving into one seamless experience. We focus on bridging generational gaps and fostering deeper connections through shared life stories.</p>
                    <h2>Getting Started</h2>
                    <p>If you have any questions or need help navigating the website, please don't hesitate to contact our friendly support team at <a href="mailto:${APP_EMAIL}">${APP_EMAIL}</a>.</p>
                    <p>Welcome aboard! We're excited to have you as part of our community.</p>
                    <p>Best regards,</p>
                    <p>The Memoria Nexus Team</p>
                </body>
                </html>`;
        await sendEmail(email, subject, html);
        console.log("Account created successfully!");

        return res.status(201).json({
            message: "You are successfully signed up",
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
            token
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
        const token = jwt.sign({ id: user._id }, SECRET_KEY_USER, { expiresIn: "24h" });
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

const signout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        // const userId = req.userId;
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({
        //         message: "User not found"
        //     });
        // }
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found. Please provide a registered email.',
                error: 'UserNotFound'
            });
        }

        const otp = generateOTP();
        console.log("OTP: ", typeof otp, otp);
        const subject = "Important: Your Memoria Nexus Password Reset Request";
        const html = `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>Hi ${user.firstName} ${user.lastName},</h1>
                <p>We received a request to reset your password for your Memoria Nexus account. To ensure the security of your account, we will be sending you a One-Time Password (OTP) that you'll need to enter to complete the reset process.</p>
                <h2>Important Security Notice</h2>
                <p>Please be aware of the following to keep your account secure:</p>
                <h2>Your OTP: <strong>${otp}</strong></h2>
                <ul>
                <li>Do not share your OTP with anyone.</li>
                <li>Only enter the OTP on the official Memoria Nexus website.</li>
                <li>If you did not request a password reset, please ignore this email or contact our support team immediately.</li>
                </ul>
                <p>To proceed with resetting your password, please use the OTP that will be sent to your registered email address shortly.</p>
                <p>If you have any questions or need further assistance, don't hesitate to contact our support team at <a href="mailto:${APP_EMAIL}">${APP_EMAIL}</a>.</p>
                <p>Best regards,</p>
                <p>The Memoria Nexus Team</p>
            </body>
            </html>`;
        await sendEmail(user.email, subject, html);
        console.log("OTP SEnt Succesfully");
        res.status(200).json({
            message: "OTP sent successfully",
            otp
        })

    } catch (e) {
        console.log("Error in /forgotpassword:", e.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }
        const user = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        const subject = "Your Memoria Nexus Password Has Been Updated";
        const html = `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                <meta charset="UTF-8">  
            </head>
            <body>
                <h1>Hi ${user.firstName} ${user.lastName},</h1>
                <p>We wanted to let you know that your password for your Memoria Nexus account has been successfully updated.</p>
                <h2>What's Next?</h2>
                <p>If you did not make this change or if you believe an unauthorized person has accessed your account, please contact our support team immediately at <a href="mailto:${APP_EMAIL}">${APP_EMAIL}</a>.</p>
                <h2>Security Tips</h2>
                <ul>
                    <li>Always use a strong, unique password for each of your accounts.</li>
                    <li>Avoid sharing your password with anyone.</li>
                    <li>Regularly update your passwords to enhance security.</li>
                </ul>
                <p>If you have any questions or need further assistance, don't hesitate to reach out to us.</p>
                <p>Best regards,</p>
                <p>The Memoria Nexus Team</p>
            </body>
            </html>`;
            console.log("Email sent")
        await sendEmail(user.email, subject, html);
        res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (e) {
        console.error('Error in /updatepassword:', e.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { signup, signin, signout, updatePassword, forgotPassword }; 
