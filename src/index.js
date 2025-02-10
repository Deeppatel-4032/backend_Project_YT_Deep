import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./db/indexDB.js";
dotenv.config({
  path: "./.env"
})
const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials : true,    
}));

app.use(express.json({limit : "15kb"}));
app.use(express.urlencoded({extended : true, limit : "15kb"}));
app.use(express.static("publice"));
app.use(cookieParser());

// routes declaration
app.use("/api/v1/users", userRoutes);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is running at port: http://localhost:${PORT}/api/v1`);
  }
});
