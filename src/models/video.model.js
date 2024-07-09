
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile:{ 
            type: string,
            required: true,
        },
        thumbnail:{
            type: string,
            required: true,
        },
        title:{
            type: string,
            required: true,
        },
        description:{
            type: string,
            required: true,
        },
        duration:{
            type: string,
            required: true,
        },
        views:{
            type: Number,
            default: 0,
        },
        isPublished:{
            type: Boolean,
            default: true,
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref:"user",
        },
    },
    {
        timestamps: true,
    }
);


videoSchema.plugin(mongooseAggregatePaginate)
 
export const videos = mongoose.model("video", videoSchema)