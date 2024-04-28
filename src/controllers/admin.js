import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ticketService from "../services/db/ticket.js";
import userService from "../services/db/user.js";

export default class adminControllers{
    static getAllUsers = catchAsyncError(async (req,res,next)=>{
        const users = await userService.getAllUsers();
        res.status(200).json({success:true,data:users});
    });
    
    static getAllOrders = catchAsyncError(async (req,res,next)=>{
        const orders = await userService.getAllOrders();
        res.status(200).json({success:true,data:orders});
    });

    static getAllTickets = catchAsyncError(async (req,res,next)=>{
        const tickets = await ticketService.getAllTickets();
        res.status(200).json({success:true,data:tickets});
    });
}