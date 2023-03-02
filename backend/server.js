const app = require("./app")

const dotenv =require('dotenv');
const connectDatabase=require('./config/database')
//setting up config file
dotenv.config({path:'backend/config/config.env'})


//Connecting to database
connectDatabase();


const server=app.listen(process.env.PORT, () => {
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
}) 
// process.on('unhandledRejection', err=>{
//     console.log(`Error:${err.message}`);
//     console.log('shutting down ther server due to unhandled promise rejection');
//     server.close(()=>{
//         process.exit(1)
//     })
// })