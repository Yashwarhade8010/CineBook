const {connect, default: mongoose} = require("mongoose")
const dotenv = require('dotenv')

dotenv.config()

const mongoConnect = async()=>{
    try{
        const mongo = await connect(process.env.MONGO_URI)
        console.log(`MongoDb connect at :${mongo.connection.host}`)
    }catch(err){
        console.log(err);
    }
}

module.exports = mongoConnect;