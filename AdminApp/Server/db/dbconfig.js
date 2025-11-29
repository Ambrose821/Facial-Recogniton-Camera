const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI,{})
    }catch(error){
        console.error("MongoDB connection error:", error);
    }
}


module.exports = connectDB