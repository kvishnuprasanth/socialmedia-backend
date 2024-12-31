const express=require('express');
const router=express.Router();
const {create,destroy,yourposts,getpost,savedposts,yourretweets,postPhoto}=require('../../controllers/post_controller')
const passport=require('passport')

router.post('/create',passport.checkAuthentication,create);
router.get('/delete/:id',passport.checkAuthentication,destroy);
router.get('/yourposts',passport.checkAuthentication,yourposts);
router.get('/getpost/:id',getpost);
router.get('/savedposts',passport.checkAuthentication,savedposts);
router.get('/yourretweets',passport.checkAuthentication,yourretweets);
router.get('/postPhoto/:id',postPhoto);

module.exports=router;