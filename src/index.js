// require('dotenv').config();
import dotenv from "dotenv";
import connectDB from "./db/indexDB.js";

dotenv.config({
    path: "./env"
})

connectDB();












/*
IFE function
import express from "express"
 const app = express();
(async() => {
    try {
      await mongoose.connect(`${process.env.MongoDb_url}/${db_Name}`)
      app.on("error", (error) => {
        console.log("Error",error);
        throw err
      })
      app.listen(process.env.PORT,(err) => {
        if(!err){
            console.log(`server is running on port http://localhost:${process.env.PORT}`) 
        }
      })
    } catch (error) {
        console.log("Error",error)
        throw err
    }
})()*/