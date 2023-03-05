const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
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