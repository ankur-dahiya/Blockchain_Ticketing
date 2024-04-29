import { errorHelper, sanitizeUser } from "../helper/helperFunctions.js";
import { createJWT } from "../helper/jwt.js";
import Web3Helper from "../helper/web3/web3Helper.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import userService from "../services/db/user.js";
import bcrypt from "bcrypt";


export default class authController{
    static login = catchAsyncError(async (req,res,next)=>{
        const {email,password} = req.body;
        const userObj = await userService.getUserByEmail(email);
        const isCorrectUser = bcrypt.compareSync(password,userObj.password);
        if(!isCorrectUser){
            return next(errorHelper(401,"invalid email or password."));
        }
        const user = sanitizeUser(userObj);
        const usertToken = createJWT(user);
        // return res.cookie("jwt",usertToken,{maxAge:(60*60*1000)}).status(200).json({success:true,data:user});
        return res.header("Authorization",usertToken).status(200).json({success:true,data:user});
    });

    static check = catchAsyncError(async (req,res,next)=>{
        return res.status(200).json({success:true,data:req.user})
    })

    static register = catchAsyncError(async (req,res,next)=>{
        const {email,name,phone,password} = req.body;
        const {privateKey,publicAddress} = Web3Helper.createWallet();
        if(!(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/g.test(email))){
            return next(errorHelper(400,"please enter valid email."))
        }
        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))){
            return next(errorHelper(400,"password should be 8-20 characters long and should contain special characters,numbers,upper and lower case alphabets."))
        }
        const userObj = await userService.createUser(email,name,phone,password,privateKey,publicAddress);
        const user = sanitizeUser(userObj);
        const usertToken = createJWT(user);
        return res.cookie("jwt",usertToken,{maxAge:(60*60*1000),httpOnly:true}).status(200).json({success:true,data:user});
    });
}