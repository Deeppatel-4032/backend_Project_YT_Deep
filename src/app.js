import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,    
}));

app.use(express.json({limit : "15kb"}));
app.use(urlencoded({extends : true, limit : "15kb"}));
app.use(express.static("publice"));
app.use(cookieParser());

export {app}