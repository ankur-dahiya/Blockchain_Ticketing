import jwt from "jsonwebtoken";
import Constants from "../constant/constants.js";
import { sanitizeUser } from "./helperFunctions.js";

const SECRET = Constants.JWT_SECRET;
export const createJWT = (user)=>{
    return jwt.sign({exp:Date.now() + (60 * 60 * 1000),user},SECRET);
}