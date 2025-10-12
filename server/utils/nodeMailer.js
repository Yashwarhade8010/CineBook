const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASS
    }
})

module.exports = transporter