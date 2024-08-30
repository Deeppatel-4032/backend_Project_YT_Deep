import { asyncHandler } from "../utils/asyncHandler.js";
import { API_Error } from "../utils/api_Error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { API_Res } from "../utils/api_Res.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user pasethi details levani chhe for frontend 
    // validation - not empty
    //file haedling 
    // check k user already exists : username, email  thi check 
    //check for image, check for Avatar
    //upload them cloudinary, Avstar
    //create the user object -  create entry in db
    //remove password and refresh token filed from response
    //check for user creation tay che ke nahi to err return karo
    //tay to response return


    const { fullName, username, email, password } = req.body;
    console.log("username", username);

    // validation
    if([fullName, username, email, password].some((field) => field?.trim() === "")) {
        throw new API_Error("All fields are required", 400)
    }

    // check if user already exists
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    });
    if(userExists) {
        throw new API_Error("User with username or email already exists", 409);
    }

    //check for image, check for Avatar
    const avatarLocalPath = req.files?.avatar[0].path
    const coverImageLocalPath = req.files?.coverImage[0].path
    // avatarLocalPath ni hoy to error show
    if(!avatarLocalPath) {
        throw new API_Error("Avatar is required", 400)
    }

    //upload them cloudinary, Avstar
   const avatarStore = await uploadOnCloudinary(avatarLocalPath);
   const coverImageStore = await uploadOnCloudinary(coverImageLocalPath);
    // avatarStore ni hoy to error show
   if(!avatarStore) {
       throw new API_Error("Avatar upload failed", 400);
   }

    //create the user object -  create entry in db

    const user = await User.create({
        fullName, 
        username : username.toLowerCase(),
        email,
        password, 
        avatar: avatarStore?.url,
        coverImage: coverImageStore?.url || ""
    })

    //remove password and refresh token filed from response
    //check for user creation tay che ke nahi to err return karo
    const createUserId = await User.findById(user._id).select("-password -refreshToken");

    if(!createUserId) {
        throw new API_Error("User creation failed", 500);
    }

    //tay to response return

    res.status(201).json(
        new API_Res("User created successfully", createUserId, 200)
    )

})

export { registerUser }