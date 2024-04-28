import {contract} from "../web3/contract.js";

contract.events.ticketCreated()
.on("data",(event)=>{
    console.log("ticketCreated event: ",event);
});
