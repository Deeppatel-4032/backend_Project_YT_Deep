import dotenv from "dotenv";
import connectDB from "./db/indexDB.js";
import {app} from "./app.js"
dotenv.config({
  path: "./.env"
})

const PORT = process.env.PORT || 8000;

//export the indexDB file
connectDB()

//asncy code lakelo che atle tecnecal te promisice pan mokale 
.then(() => {
  console.log("MongoDB connected successfully.....!!");
  app.listen(PORT, () => {
    console.log(`Server is running at port: http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.log("MongoDB connection failed.....!! :", err);
});
