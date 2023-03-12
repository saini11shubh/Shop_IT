const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile, updatePassword, updateProfile,getAllUsers,deleteUser,getUserDetails,updateUser,
    logout } =
    require('../controllers/authController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/password/reset/:token', resetPassword)
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword)
router.put('/me/update', isAuthenticatedUser, updateProfile)
router.get('/logout', logout);


router.get('/admin/users', isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);
router.get('/admin/user/:id', isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
router.put('/admin/user/:id', isAuthenticatedUser,authorizeRoles('admin'),updateUser);
router.delete('/admin/user/:id', isAuthenticatedUser,authorizeRoles('admin'),deleteUser);
module.exports = router;