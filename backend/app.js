const express = require("express");
const app = express();
const errorMiddleware = require('./middlewares/error')


const cookieParser = require('cookie-parser');
app.use(express.json())
app.use(cookieParser())


//Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order=require('./routes/order');

app.use('/', products)
app.use('/auth', auth)
app.use('/auth', order)

app.use(errorMiddleware);

module.exports = app;