const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
const bcrypt=require('bcrypt')

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },async (req,email,password,done)=>{
        //find a user and estblish identity
        try {
            let user=await User.findOne({email:email});
                let match
                if(user)
                   match=await bcrypt.compare(password,user.password);
            if(!user || !match){
                console.log('error','Invalid Username/Password');
                return done(null,false)
            }
            return done(null, user);
        } catch (error) {
           console.log('error',error);
            return done(error);
        }
    }
))

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try {
        let user=await User.findById(id);
        return done(null,user);
    
    } catch (error) {
        console.log("error in finding user -->passport");
            return done(error);
    }
});

passport.checkAuthentication=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({msg:"not authenticated"})
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;