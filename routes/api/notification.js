const express = require('express');
const router = express.Router();
const passport=require('passport');
const {getnotifications,destroy}=require('../../controllers/notifications_controller')

router.get('/getnotifications',passport.checkAuthentication,getnotifications);
router.post('/delete/:id',passport.checkAuthentication,destroy);

module.exports = router;