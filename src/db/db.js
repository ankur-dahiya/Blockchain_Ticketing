import mongoose from "mongoose";
import Constants from "../constant/constants.js";

(async ()=>{
    mongoose.connect(Constants.DB_URL+"/TicketBookingDAPP").then(()=>{console.log("mongodb connected..")}).catch(err=>console.log(`error occured while connecting to database ${err.message}`))
})();