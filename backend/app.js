const express=require("express");
const app= express();
const errorMiddleware=require('./middlewares/error')
app.use(express.json())


//Import all routes
const products=require('./routes/product');

app.use('/',products)

app.use(errorMiddleware);

module.exports=app;