const express = require('express');
const router = express.Router();
const {create,update,userAvatar,createSession,destroySession,sendOTP,verifyOtp,getuser,userdetails,getReceiver}=require('../../controllers/user_controller')
const passport=require('passport')

router.post('/create',create)
router.post('/update',passport.checkAuthentication,update);
router.get('/userAvatar/:id',userAvatar);
router.post('/create-session',(req,res,next)=>{
    passport.authenticate('local',async (err,user,info)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!user){
            return res.status(401).json({msg:"no user found"})
        }
        await req.logIn(user,(err)=>{
            if(err) return res.status(500).json({err})
            next();
        });
        
    })(req, res, next);
}, createSession);
router.get('/sign-out', destroySession);
router.post('/sendOtp', sendOTP);
router.post('/verifyOtp', verifyOtp);
router.get('/getuser',passport.checkAuthentication, getuser);
router.get('/userdetails/:id', userdetails);
router.get('/getReceiver/:id', getReceiver);

//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email'] }));
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'https://socialdraft.onrender.com',failureRedirect:'https://socialdraft.onrender.com'}),createSession);

//facebook
router.get('/auth/facebook',passport.authenticate('facebook',{ scope :'email' }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {successRedirect:'https://socialdraft.onrender.com',failureRedirect:'https://socialdraft.onrender.com'}),createSession);


module.exports = router;