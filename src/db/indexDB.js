import mongoose from "mongoose";

const connectDB = mongoose.connect(process.env.MONGOOSEDB_URL).then(() => {
    console.log("Database is Connected....!");
    
}).catch((err) => {

    console.log("Database is not Connected....!");
})

export default connectDB;