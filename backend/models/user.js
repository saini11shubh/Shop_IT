const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'plese enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'please enter your valid email address'],
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minLength: [6, 'Your password must be at least 6 characters'],
        maxLength: [30, 'Your password cannot exceed 30 characters'],
        select: false,   // whenever i want to display the user ....I don't want to display password to the user
        trim: true
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date       //stor exprie date of the token

})


//1. we cannot use this keyword in arrow function so we use simple function
//2. Encrpting password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//compare user password
userSchema.methods.comparePassword = async function (password) {
    console.log("this.password: " + this.password)
    console.log("password: " + password)
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.getJwtToken = function () {
    console.log("this ._id");
    console.log(this._id);
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//Generate password reset token 
userSchema.methods.getResetPasswordToken=function () {
    //Generate token
    console.log('Generating password reset token')
    const resetToken=crypto.randomBytes(20).toString('hex');

    //hash and set to resetPassword token
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    //Set token expire time
    this.resetPasswordExpires=Date.now()+30*60*1000;

    return resetToken
}
module.exports = mongoose.model('User', userSchema);