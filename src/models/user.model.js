import mongoose, {schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new schema({

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
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String, //cloudinary url
        required : true,
   },
   coverImage : {
    type : String, //cloudinary url
    required : true,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "video"
        }
    ],
    followers : [
        {
            type : Schema.Types.ObjectId,
            ref : "user"
        }
    ],
    following : [
        {
            type : Schema.Types.ObjectId,
            ref : "user"
        }
    ],
    isAdmin : {
        type : Boolean,
        default : false
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    refreshToken : {
        type : String
    },
}, 
{timestamps : true});

// chack password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 8)
    next();
});

//maching the password
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
}

//token generat
userSchema.methods.generateToken = function() {
    return jwt.sign({
        _id : this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName,
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
};
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        
        _id : this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
};

export const User = mongoose.model("user", userSchema)