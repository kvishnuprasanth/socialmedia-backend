const nodemailer=require('../config/nodemailer');

module.exports.sendOtp = async(email,otp) => {   
   try {
    let info=await nodemailer.transporter.sendMail({
        from: process.env.AUTH_MAILER_EMAIL,
        to: email,
        subject: "OTP",
        html: `your otp = ${otp}`
     });
     console.log('mail sent',info);
     return ;
   } catch (error) {
    console.log('error in sendind mail',error);
   }
    
}