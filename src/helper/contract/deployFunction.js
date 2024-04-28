import Constants from "../../constant/constants.js";
import { CONTRACT_ABI,CONTRACT_BYTECODE } from "../../web3/deployingScript.js";
import {web3} from "../../web3/web3.js";


export async function deployContract(){
    let Contract_Addr;
    const Owner_Addr = Constants.OWNER_ADDR;
    const temp_contract = new web3.eth.Contract(CONTRACT_ABI);
    //contract is the instance of contract it can be used to call contract functions
    const contract = await temp_contract
        .deploy({data:CONTRACT_BYTECODE})
        .send({from:Owner_Addr,gas:3013530})
        .on("receipt",(receipt)=>{
            Contract_Addr = receipt.contractAddress;
            console.log("Contract Address is: ",Contract_Addr);
        });
    return Contract_Addr;
};