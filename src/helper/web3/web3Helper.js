import Constants from "../../constant/constants.js";
import {web3} from "../../web3/web3.js";

export default class Web3Helper {
    static createWallet = ()=>{
        const {address,privateKey} = web3.eth.accounts.create();
        return {publicAddress:address,privateKey};
    }

    static transferBalance = async (amount,gasPrice,receiverAddr)=>{
        return new Promise(async (res,rej)=>{
            const senderPvtKey = Constants.OWNER_PVT_KEY;
        const senderAddr = Constants.OWNER_ADDR;
        // const amountInWei = web3.utils.toWei(amount,"ether");
        const txObject = {
            from: senderAddr,
            to: receiverAddr,
            // value: amountInWei,
            value: amount,
            gas: 21000, // adjust gas limit as needed
            gasPrice // adjust gas price as needed
        };

        await web3.eth.accounts.signTransaction(txObject, senderPvtKey)
        .then(async signedTx => {
            // Send the signed transaction
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on('receipt', function(receipt){
                    // console.log("transferred gasfees to vendor");
                    res(receipt);
                })
                .on('error', (err)=>{console.log(err);rej(err)});
        })
        .catch(error => {
            console.error('Error signing transaction:', error);
            rej(error);
        });
        })

    }
}