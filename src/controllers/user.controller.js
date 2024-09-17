// get user pasethi details levani chhe for frontend 
// validation - not empty
// file haedling 
// check k user already exists : username, email  thi check 
// check for image, check for Avatar
// upload them cloudinary, Avstar
// create the user object -  create entry in db
// remove password and refresh token filed from response
// check for user creation tay che ke nahi to err return karo
// tay to response return

import { asyncHandler } from "../utils/asyncHandler.js";
import { API_Error } from "../utils/api_Error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { API_Res } from "../utils/api_Res.js";



const registerUser = asyncHandler( async (req, res) => {
   
    const { fullName, userName, email, password } = req.body;
    
    console.log("fullName : ", fullName);
    
    // validation
    if([fullName, userName, email, password].some((field) => field?.trim() === "")) {
        throw new API_Error("All fields are required", 400) 
    }

    // check if user already exists
    const userExists = await User.findOne({
        $or: [{ userName }, { email }]
    });
    if(userExists) {
        throw new API_Error("User with username or email already exists", 409);
    }

    //check for image, check for Avatar
    const avatarLocalPath = req.files?.avatar[0].path;
    // const coverImageLocalPath = req.files?.coverImage[0].path; // advaced method

    // imgeCover bug hoy te mate solution classce method
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log("avatarLocalPath", avatarLocalPath);
    console.log("coverImageLocalPath", coverImageLocalPath);
    

    // avatarLocalPath ni hoy to error show
    if(!avatarLocalPath) {
        throw new API_Error("Avatar is required", 400)
    }

    //upload them cloudinary, Avstar
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   console.log("avatar", avatar);
   
    // avatarStore ni hoy to error show
   if(!avatar) {
       throw new API_Error("Avatar upload failed", 400);
    }

    const newUser = await User.create({
        fullName,
        userName : userName.toLowerCase(),
        email,
        password,
        avatar : avatar,
        coverImage: coverImage?.url || "",
    })
    console.log("newUser", newUser);
    
    //remove password and refresh token filed from response
    //check for user creation tay che ke nahi to err return karo

    const createUserId = await User.findById(newUser._id).select("-password -refreshToken");

    // check createUserId 
    if(!createUserId) {
        throw new API_Error("User creation failed", 500);
    }

    //tay to response return
    res.status(201).json(
        new API_Res("User created successfully", createUserId, 200)
    )

})

export { registerUser }

