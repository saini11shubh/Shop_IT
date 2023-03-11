const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,updatePassword,
    logout } =
    require('../controllers/authController')

const {isAuthenticatedUser}=require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/password/reset/:token', resetPassword)
router.get('/me', isAuthenticatedUser,getUserProfile);
router.put('/password/update', isAuthenticatedUser,updatePassword)
router.get('/logout', logout);
module.exports = router;