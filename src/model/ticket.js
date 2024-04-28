import mongoose,{Schema} from "mongoose";
import Image from "./image.js";
// import User from "./user.js";

const ticketSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    ticketId:{
        type:Number,
        required:true,
        unique:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    vendor:{
        type:Schema.Types.ObjectId,
        // ref:User,
        required:true
    },
    image:{
        type:Schema.Types.ObjectId,
        ref:Image
    },
    showDate:{
        type:Date,
        required:true
    }
},{timestamps:true});

// TOOD: create virtual to convert buffer to base64 on get request 

export default mongoose.model("ticket",ticketSchema);