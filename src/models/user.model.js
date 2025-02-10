import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"


const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : [true, "password is required"]
    },
    avatar : {
        type : String, //cloudinary url
        required : true,
   },
   coverImage : {
        type : String, //cloudinary url
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "video"
        }
    ],
    refreshToken : {
        type : String
    },
}, 
{timestamps : true});


userSchema.pre("save", async function(next) {
    if(!this.isModified("password"))return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//maching the password
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
}

//token generat
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
    {
        _id : this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName,
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
};
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
    {
       _id : this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
};

export const User = mongoose.model("user", userSchema)