const express=require('express');
const router=express.Router();
const {toggleLike}=require('../../controllers/like_controller')
const passport=require('passport')


router.post('/',passport.checkAuthentication,toggleLike)

module.exports=router;