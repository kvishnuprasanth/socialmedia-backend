const express=require('express');
const router=express.Router();
const {home}=require('../../controllers/home_controller')

router.use('/user',require('./user'))
router.use('/post',require('./post'))
router.use('/notification',require('./notification'))
router.use('/comment',require('./comment'))
router.use('/like',require('./like'))
router.use('/follow',require('./follow'))
router.use('/bookmark',require('./bookmark'))
router.use('/retweet',require('./retweet'))
router.use('/chat',require('./message'))
router.use('/is',require('./is'))
router.use('/home',home)

module.exports=router;