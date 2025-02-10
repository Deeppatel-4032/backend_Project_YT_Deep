import { asyncHandler } from "../utils/asyncHandler.js";
import { API_Error } from "../utils/api_Error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJwt = asyncHandler(async (req, res, next) => {

  try {
    const token = req.cookies?.access_Token || req.header("Authorization")?.replace("Bearer", "");
      console.log("token", token);
      
  
    if (!token) {
          throw new API_Error("Authentication required", 401);
      } 
  
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
      const userToken = await User.findById(decoded?._id).select("-password -refreshToken");
  
      if (!userToken) {
          throw new API_Error("invalid access Token", 401);
      }
  
      req.user = userToken;
      next();
  } catch (error) {
    throw new API_Error("invalid access Token" || error?.message, 401);
  }
});