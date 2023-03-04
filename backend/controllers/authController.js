const User =require('../models/user'); 

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors=require('../middlewares/catchAsyncErrors');

//Register a user => /register
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    console.log(req.body);
    const {name,email,password} = req.body;
    const user = await User.create({name,email,password,
    avatar:{
        public_id:'avatars/kccvibpsuiusmwfepb3m',
        url:'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png'
    }
    });

    console.log(user);
    const token = user.getJwtToken();
    // res.status(201).json({user,token});
    res.status(201).json({
        success:true,
        token 
    });
});
 
