import { errorHelper } from "../helper/helperFunctions.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ticketService from "../services/db/ticket.js";
import userService from "../services/db/user.js";

export default class ticketController{
    static createTicket = catchAsyncError(async (req,res,next)=>{
        const user = req.user;
        const {buffer,mimetype} = req.file;
        if(!(user.role=="vendor" || user.role=="admin")){
            return next(errorHelper(401,"not authorized"));
        }
        let {name,quantity,showDate,price} = req.body;
        price = +price;
        quantity = +quantity;
        const show_date = new Date(showDate);
        const userObj = await userService.getUserById(user._id);
        const ticketObj = await ticketService.createDBTicket(quantity,userObj.publicAddress,name,show_date,user._id,price,{buffer,mimeType:mimetype});
        res.status(200).json({success:true,data:ticketObj});
    });

    static purchaseTicket = catchAsyncError(async (req,res,next)=>{
        const user = req.user;
        const {ticketId} = req.body;
        await ticketService.purchaseTicket(ticketId,user.publicAddress,user._id);
        res.status(200).json({success:true,message:"ticket purchase successful"});
    });
    
}