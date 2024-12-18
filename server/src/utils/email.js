const nodemailer = require('nodemailer');
const {APP_EMAIL,APP_PASSWORD} = require('../../constants');

const transporter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    post : 587,
    secure : false,
    auth : {
        user : APP_EMAIL,
        pass : APP_PASSWORD
    }
});

async function sendEmail(email,subject,html){
    try {
        const mailOptions = {
            from : {
                name : "MemoriaNexus",
                address : process.env.APP_EMAIL
            },
            to : email,
            subject : subject,
            html : html
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully : ", info.messageId)
    } catch (error) {
        console.error("Error sending email : ",err);
    }
};

module.exports = {sendEmail};