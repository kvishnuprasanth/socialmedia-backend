const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const signUpMail=require('../mailers/signUp');

const gStrategy=new googleStrategy({
   clientID:process.env.GOOGLE_CLIENT_ID,
   clientSecret:process.env.GOOGLE_CLIENT_SECRET,
   callbackURL:process.env.GOOGLE_CALLBACKURL
    },async (accessToken,refreshToken,profile,done)=>{
        try {
            let user=await User.findOne({email:profile.emails[0].value}).exec();
            if(user){
                return done(null,user);
            }else{
                try {
                    let person=await User.create({
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:crypto.randomBytes(20).toString('hex'),
                        photoLocal:true,
                        photoLocal_path:'default_avatars/avatar_1.png'
                    })
                    signUpMail.signUp(person.email)
                    return done(null,person);
                } catch (err) {
                    console.log("error in  creating user google passport",err);
                    return ;
                }

            }
        } catch (err) {
            console.log("error in google strategy passport",err);
            return ;
        }
    }
);

passport.use(gStrategy);

module.exports=passport;