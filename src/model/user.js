import mongoose,{Schema} from "mongoose";
import Order from "./order.js";

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["user","admin","vendor"],
        required:true,
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    orders:[{
        type:Schema.Types.ObjectId,
        ref:Order
    }],
    privateKey:{
        type:String,
        required:true
    },
    publicAddress:{
        type:String,
        required:true
    },
    //optional
    // profilePic:{
    // }
},{timestamps:true});

export default mongoose.model("user",userSchema);