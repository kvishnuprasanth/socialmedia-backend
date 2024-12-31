const express=require('express');
const router=express.Router();
const {isliked,isfollow,issaved,retweeted}=require('../../controllers/is_controller')
const passport=require('passport')

router.get('/liked',passport.checkAuthentication,isliked)
router.get('/saved',passport.checkAuthentication,issaved)
router.get('/retweeted',passport.checkAuthentication,retweeted)
router.get('/follow',passport.checkAuthentication,isfollow)

module.exports=router;