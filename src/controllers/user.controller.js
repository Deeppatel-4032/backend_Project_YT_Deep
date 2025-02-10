import { asyncHandler } from "../utils/asyncHandler.js";
import { API_Error } from "../utils/api_Error.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { API_Res } from "../utils/api_Res.js";
import jwt from "jsonwebtoken";

//generateAccessAndRefreshTokon comne hende
const generateAccessAndRefreshTokon = async (userId) => {
    try {
       const userIdFind = await User.findById(userId);
       const accessToken = userIdFind.generateAccessToken();
       const refreshToken = userIdFind.generateRefreshToken();

       userIdFind.refreshToken = refreshToken;
       await userIdFind.save({ validateBeforeSave : false });

       return { accessToken, refreshToken };

    } catch (err) {
        throw new API_Error("somting went wron while generat access and referesh token")
        
    }
}

//registerUserCon user register 
const registerUserCon = asyncHandler(async (req, res) => {
  console.log("req.body : ", req.body);
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

  const { userName, email, password } = req.body;

  // validation
  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new API_Error("All fields are required", 400);
  }

  // check if user already exists
  const userExists = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (userExists) {
    throw new API_Error("User with username or email already exists", 409);
  }

  //check for image, check for Avatar
  const avatarLocalPath = req.files?.avatar[0].path;
  // const coverImageLocalPath = req.files?.coverImage[0].path; // advaced method

  // imgeCover bug hoy te mate solution classce method
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log("avatarLocalPath", avatarLocalPath);
  console.log("coverImageLocalPath", coverImageLocalPath);

  // avatarLocalPath ni hoy to error show
  if (!avatarLocalPath) {
    throw new API_Error("Avatar is required", 400);
  }

  //upload them cloudinary, Avstar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  console.log("avatar", avatar);

  // avatarStore ni hoy to error show
  if (!avatar) {
    throw new API_Error("Avatar upload failed", 400);
  }

  const newUser = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatar,
    coverImage: coverImage?.url || "",
  });
  console.log("newUser", newUser);

  //remove password and refresh token filed from response
  //check for user creation tay che ke nahi to err return karo

  const createUserId = await User.findById(newUser._id).select("-password -refreshToken");

  // check createUserId
  if (!createUserId) {
    throw new API_Error("User creation failed", 500);
  }

  //tay to response return
  res.status(201).json(new API_Res("User created successfully", createUserId, 200));
});

//loginUserCon loging 
const loginUserCon = asyncHandler(async (req, res) => {
  // req.body = data check
  //username or email
  //find the user
  //check password
  //generate access and referesh token
  //send the cookie

  // req.body = data check
  const { userName, email, password } = req.body;

  if (!userName && !email) {
      throw new API_Error("userName and email field required", 400);
    }

  // username or email find
  const userFind = await User.findOne({
    $or: [{ userName }, { email }],
  });        

  //check the user already exist Y/N
  if (!userFind) {
      throw new API_Error("User not found", 404);
    }

  //check password
  const PasswordValid = await userFind.isPasswordCorrect(password);

  //wrong the pass throw err
  if(!PasswordValid) {
      throw new API_Error("Invalid password", 401);
    }

  //generate access and referesh token
  const { accessToken, refreshToken} = await generateAccessAndRefreshTokon(userFind._id);

  //check loggedInUser
  const loggedInUser = await User.findById(userFind._id).select("-passwoes -refreshToken");

  //cookie send
  const options = { httpOnly : true, secure : true };
    
  return res.status(200)
  .cookie("access_Token", accessToken, options)
  .cookie("refresh_Token", refreshToken, options)
  .json(
    new API_Res(200,
      {
        user : loggedInUser, accessToken, refreshToken
      },
      "Login successfully"
    )
  )
});

//logOut User
const userLogoutCon = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    await req.user._id,
    {
      $unset : { refreshToken : 1,  new : true },
    }
  )

  const options = { httpOnly : true, secure : true };

  return res.status(200)
  .clearCookie("access_Token", options)
  .clearCookie("refresh_Token", options)
  .json(new API_Res(200, "Logout successfully", {}));

});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  // Check The incomingRefreshToken
  if(incomingRefreshToken) {
    throw new API_Error(401, "unauthorized request")
  }
  try {
  
    // jwt verify user
    const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    // Find The User
    const user = await User.findById(decodeToken?._id);
  
    //chek user Che ke nai
    if(!user) {
      throw new API_Error(401, "invalid Refresh Token");
    }
  
    // match the incomingRefreshToken or userRefreshToken sem che ki nai
    if(incomingRefreshToken !== user?.refreshToken) {
      throw new API_Error(401, "Refresh Token is expired or Used");
    }
  
    
    const options = { httpOnly : true, secure : true };
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokon(user._id);
  
    return res.status(200)
    .cookie("access_Token", accessToken, options)
    .cookie("refresh_Token", newRefreshToken, options)
    .json(
      new API_Res(200,
        {
          accessToken,
          refreshToken : newRefreshToken
        },
        "Access Token Refresheded"
      )
    )
  } catch (error) {
    throw API_Error(401, "Invalid Refresh Token")
  }

})

export { registerUserCon, loginUserCon, userLogoutCon, refreshAccessToken };
