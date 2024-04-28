import mongoose,{Schema} from "mongoose";

const imageSchema = new Schema({
    buffer:{
        type: Buffer,
        required: true
    },
    mimeType:{
        type:String,
        required:true
    }
},{timestamps:true});

export default mongoose.model("image",imageSchema);