const express = require('express');
const router = express.Router();
const passport=require('passport')
const {toggleRetweet}=require('../../controllers/retweet_controller')

router.post('/',passport.checkAuthentication,toggleRetweet);

module.exports = router;