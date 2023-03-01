const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
// const MONGO_URL="mongodb+srv://root:root@cluster0.anxpl4q.mongodb.net/ShopIT"
const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI).then(con => {
        // mongoose.connect(MONGO_URL).then(con => {
        console.log(`MongoDb Database connected with HOST:${con.connection.host}`);
    })
}
module.exports = connectDatabase