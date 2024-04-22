const router = require('express').Router();
const UserController = require('../controller/UserController');

router.post('/create-user',UserController.CreateUser);
router.post('/login-user',UserController.Login);
router.post('/send-otp',UserController.SendOtp);
router.post('/verify-otp',UserController.VerifyOTP);

module.exports = router
