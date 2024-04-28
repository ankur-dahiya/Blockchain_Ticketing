import { catchAsyncError } from "./catchAsyncError.js";

export const isAdmin = catchAsyncError((req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(404).json({success:false,message:"not found"});
    }
    next();
})