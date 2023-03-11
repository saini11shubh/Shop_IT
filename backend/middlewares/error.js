const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message

        //wrong mongoose object id
        if (err.name === 'castError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //wrong Mogoose valiedation Error
        if (err.name === 'ValidationError') {
            // const message = Object.values(err.errors).map(values => values.message);
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        //Handling mongoose duplicate key error
        if (err.code === 11000) {
            const message = 'Duplicate field value entered'
            error = new ErrorHandler(message, 400)
        }

        //Handling wrong JWT error
        if(err.name==='JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Please try again !!!'
            error = new ErrorHandler(message, 400)
        }

        //Handling Expired JWT error
        if(err.name==='TokenExpiredError') {
            const message = 'JSON Web Token is expired. Please try again !!!'
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }
}