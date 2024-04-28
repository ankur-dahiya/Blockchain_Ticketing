import mongoose,{Schema} from "mongoose";
import Ticket from "./ticket.js";

const orderSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true
    }
    ,
    amount:{
        type:Number,
        required:true
    },
    ticket_id:{
        type:Schema.Types.ObjectId,
        ref:Ticket
    }
},{timestamps:true});

export default mongoose.model("order",orderSchema);