// require('dotenv').config();
import dotenv from "dotenv";
import connectDB from "./db/indexDB.js";
const PORT = process.env.PORT || 8000;

dotenv.config({
    path: "./env"
})

//export the indexDB file
connectDB()
//asncy code lakelo che atle tecnecal te promisice pan mokale 
.then(() => {
  app.on("error",(err) => {
    console.log("server on erroe", err);
    throw err
  })
  app.listen(PORT, () =>{
    console.log(`server is runing at port : http://localhost:${PORT}`);
  })
})
.catch((err) => {
    console.log("mongodb connection fild Error.....!",err)
})


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