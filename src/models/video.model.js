import mongoose, {schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new schema({
    videoFile : {
        type : String, //cloudinary url
        required : true
    },
    title : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String, // cloudinary url
        required : true
    },
    description : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    views : {
        type : Number,
        default : 0
    },
    isPublished : {
        type : Boolean,
        default : true
    },
    owner : {
        type : schema.Types.ObjectId,
    }

   
},{Timestamps : true});

videoSchema.plugin(mongooseAggregatePaginate);

export const video = mongoose.model("video", videoSchema);