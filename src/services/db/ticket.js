import Image from "../../model/image.js";
import Order from "../../model/order.js";
import Ticket from "../../model/ticket.js";
import User from "../../model/user.js";
import ContractCalls from "../contract/functionCalls.js"


export default class ticketService{
    static createDBTicket = async (quantity,vendorAddr,name,showDate,vendor,price,{buffer,mimeType})=>{
        try{
            const ticketId = await ContractCalls.createTicket(quantity,vendorAddr);
            const img = new Image({buffer,mimeType});
            const imageObj = await img.save();
            const ticket = new Ticket({name,vendor,ticketId,quantity,showDate,price,image:imageObj._id});
            const ticketObj = await ticket.save();
            return ticketObj.populate("image");
        }
        catch(error){
            console.log("ticket error: ",error);
            throw new Error("Ticket creation failed:",error.message);
        }

    }

    static purchaseTicket = async (ticket_id,userAddress,userId) =>{
        const ticketObj = await Ticket.findOne({ticketId:ticket_id});
        const vendor = await User.findById(ticketObj.vendor);
        // TOOD: get latest ticket count and update it in ticket
        await ContractCalls.buyTicket(vendor.privateKey,vendor.publicAddress,ticket_id, userAddress);
        ticketObj.quantity -= 1;
        await ticketObj.save();
        const order = new Order({amount:ticketObj.price,ticket_id:ticketObj._id,userId});
        const orderObj = await order.save();
        await User.updateOne({publicAddress:userAddress},{$push:{"orders":orderObj._id}});
    }

    static getAllTickets = async ()=>{
        return await Ticket.find().populate("image");
    }
}