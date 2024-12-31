const express = require('express');
const router = express.Router();
const passport=require('passport');
const {create,destroy,getcomments}=require('../../controllers/comment_controller')

router.post('/create',passport.checkAuthentication,create);
router.get('/delete/:id',passport.checkAuthentication,destroy);
router.get('/getcomments/:id',getcomments);

module.exports = router;