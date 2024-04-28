import { catchAsyncError } from "../middleware/catchAsyncError.js";
import userService from "../services/db/user.js";

export default class userController{
    static getUserOrders = catchAsyncError(async (req,res,next)=>{
        const user = req.user;
        const orders = await userService.getUserOrders(user._id);
        return res.status(200).json({success:true,data:orders});
    });
}