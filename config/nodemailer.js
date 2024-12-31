const nodemailer=require('nodemailer');
//creating transporter for mailing
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_MAILER_EMAIL,
        pass: process.env.AUTH_MAILER_PASS
    }

  });

  module.exports = {
    transporter: transporter
}