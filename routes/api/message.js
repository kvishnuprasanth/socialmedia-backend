const express = require('express');
const router = express.Router();
const passport=require('passport');
const {addMessage,getMessages}=require('../../controllers/message_controller')

router.post('/addMessage',passport.checkAuthentication,addMessage);
router.post('/getMessages',passport.checkAuthentication,getMessages);

module.exports = router;