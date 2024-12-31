const nodemailer=require('../config/nodemailer');

module.exports.signUp = async(email) => {
   
   try {
    let info=await nodemailer.transporter.sendMail({
        from:process.env.AUTH_MAILER_EMAIL,
        to: email,
        subject: "Thank You",
        html: `Succesfully register on SocialMedia`
     });
     return ;
   } catch (error) {
    console.log('error in sendind mail',error);
   }
    
}