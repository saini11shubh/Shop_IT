const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

//Register a user => /register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: 'avatars/kccvibpsuiusmwfepb3m',
            url: 'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png'
        }
    });

    console.log(user);
    const token = user.getJwtToken();
    // res.status(201).json({user,token});
    res.status(201).json({
        success: true,
        token
    });
    // sendToken(user, 200,res)
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //check if email and pasword is entered by user
    if (!email || !password) {
        // console.log("ddddddddddd")
        return next(new ErrorHandler('Plese Enter email and password', 400))
    }

    //Finding user in data base
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    //checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 400));
    }

    // const token=user.getJwtToken();
    // res.status(200).json({
    //     success:true,
    //     token 
    // });
    // console.log("dddddddddd")
    sendToken(user, 200, res)

})

//Forgot Password  =>  /password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new ErrorHandler('user not found with this email', 404)
        )
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });     //disable validation before save data

    //create reset password url
    //protocol -- http ,https
    //host == localhost or main server
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    console.log(resetUrl)
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        });
        res.status(200).json({
            success: true,
            message: `An email has been sent to ${user.email} email`
        })
    } catch (error) {
        user.resetPasswordToken = undefined; // if we get any error then we save undefined in reset password
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });     //disable validation before save data
    }
})


//Reset Password  =>  /password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired. Please try again', 400))
    }
    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler('Password does not match. Please try again', 400))
    }

    //setup new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    sendToken(user, 200, res)
})

//Get currently logged in user details =>/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update / Change password =>/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Check previous user password 
    const isMatched=await user.comparePassword(req.body.oldPassword)
     if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400))
    }
    user.password=req.body.password;
    await user.save();
    sendToken(user, 200, res)
})


exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
})