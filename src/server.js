import express from "express";
import Constants from "./constant/constants.js";
import "./db/db.js";
import cookieParser from "cookie-parser";
import {Strategy as JwtStrategy} from 'passport-jwt';
import { cookieExtractor, sanitizeUser } from "./helper/helperFunctions.js";
import authRouter from "./routes/auth.js";
import ticketRouter from "./routes/ticket.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import passport from "passport";
import userService from "./services/db/user.js";
import session from "express-session";
import "./worker/eventListener.js";

const server = express();

server.use(cookieParser());
server.use(express.json());
server.use(session({
    secret: Constants.JWT_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));

//routers
server.use("/auth",authRouter);
server.use("/ticket",ticketRouter);
server.use("/user",userRouter);
server.use("/admin",adminRouter);

server.use((error,req,res,next)=>{
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({success:false,message});
});

// JWT options
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = Constants.JWT_SECRET; 
passport.use("jwt",new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        // jwt_payload will contain the decrypted values from bearer token
        const {user,exp} = jwt_payload;
        if(exp <= Date.now()){ //if session expired dont return user
            throw new Error("expired token");
        }
        const userObj = await userService.getUserById(user._id);
        if (userObj) {
            return done(null, sanitizeUser(userObj)); //this calls serializer
        } else {
            return done(null, false);
        }
    }
    catch(err){
        return done(err, false);
    }    
    })
);

// this creates session variable req.user on being called
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

// this changes session variable to req.user when called from authorized request
//this gets the userinfo from session/cookies
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });


server.listen(Constants.PORT,()=>{
    console.log(`server is running on port: ${Constants.PORT}`);
})