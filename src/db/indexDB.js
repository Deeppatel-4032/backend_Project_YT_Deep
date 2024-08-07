import mongoose from "mongoose";
import {db_Name} from "../constants.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGOOSEDB_URL}/${db_Name}`);
            console.log(`MongoDB Connected: DB HOST:${connectionInstance.connection.host}`)
    } catch (error){
        console.log("mongoose connection Error", error);
        process.exit(1);
    }
}

export default connectDB