import bcrypt from "bcrypt";
import User from "../../model/user.js";
import Order from "../../model/order.js";

export default class userService{
    static createUser = async (email,name,phone,password,privateKey,publicAddress)=>{
        return new Promise((res,rej)=>{
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async function(err, passHash) {
                if(err) throw new Error("error while hashing password: ",err.message);
                try{
                    const createUser = new User({email,name,phone,password:passHash,privateKey,publicAddress});
                    const user = await createUser.save();
                    res(user);
                }
                catch(error){
                    console.log("error while saving user to db:",error);
                    rej(new Error("error while saving user to DB:",error.message));
                }
            });
        })
    }

    static getUserByEmail = async (email)=>{
        return await User.findOne({email});
    }

    static getUserById = async (userId)=>{
        const user = await User.findById(userId);
        if(!user) throw new Error("user not found");
        return user;
    }

    static getUserOrders = async (userId)=>{
        const user = await User.findById(userId).populate({ 
            path: 'orders',
            populate: {
              path: 'ticket_id',
              populate:{
                path: "image"
              }
            }
          });
        if(!user) throw new Error("user not found");
        return user.orders;
    }

    static getAllUsers = async ()=>{
        const users = await User.find().select("-password -privateKey");
        return users;
    }

    static getAllOrders = async ()=>{
        const orders = await Order.find();
        return orders;
    }
}