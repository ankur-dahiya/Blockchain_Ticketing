import Constants from "../../constant/constants.js";
import {contract,CONTRACT_ADDR,CONTRACT_ABI} from "../../web3/contract.js";
import {web3} from "../../web3/web3.js";


function decodeLogs(receipt) {
    const logs = receipt.logs;
    const decodedLogs = [];

    logs.forEach(log => {
        const decoded = web3.eth.abi.decodeLog(
          [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_ticketId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_ticketAmt",
              "type": "uint256"
            }
          ],
            log.data,
            [log.topics[0]]
        );
        decodedLogs.push(decoded);
    });

    return decodedLogs;

// const decodedLogs = logs.map(log => {
//     const event = CONTRACT_ABI.find(entry => entry.type === 'event' && entry.name === log.topics[0]);
//     if (event) {
//         const decoded = web3.eth.abi.decodeLog(event.inputs, log.data, log.topics.slice(1));
//         return { event: event.name, args: decoded };
//     } else {
//         return null;
//     }
// }).filter(log => log !== null);

// return decodedLogs;

}


export default class ContractCalls {
  static createTicket = async (ticketAmt, vendorAddr) => {
    const privateKey = Constants.OWNER_PVT_KEY; // Your Ethereum address
    const fromAddress = Constants.OWNER_ADDR;
    // const privateKey = "0xb7beae70dbc01909b25aeeabf2a63276e4323c806c33587808f89486fbf87742"; // Your Ethereum address
    // const fromAddress = "0x33245bdc311dafF1F3CF144055f39F8eC60fDffA";
    
      try {
        // Prepare the transaction object
        const txObject = contract.methods.createTicket(ticketAmt, vendorAddr);
        const txData = txObject.encodeABI();
        const gas = await txObject.estimateGas({ from: fromAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(fromAddress);

        const txParams = {
          from: fromAddress,
          to: CONTRACT_ADDR,
          data: txData,
          gas,
          gasPrice,
          nonce,
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          privateKey
        );

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        console.log("Transaction receipt:", receipt);
        // console.log("decoded logs: ",decodeLogs(receipt));
      } catch (error) {
        console.log("Transaction Error:",error.message);
        throw new Error("Transaction Error while creating ticket");
      }
  };

  static buyTicket = async (vendor_key,vendor_addr,ticketId, buyerAddr) => {
    const privateKey = Constants.OWNER_PVT_KEY; // Your Ethereum address
    const fromAddress = Constants.OWNER_ADDR;
    // const fromAddress = "0x33245bdc311dafF1F3CF144055f39F8eC60fDffA";
    
      try {
        // Prepare the transaction object
        const txObject = contract.methods.transferTicket(ticketId, buyerAddr);
        const txData = txObject.encodeABI();
        const gas = await txObject.estimateGas({ from: vendor_addr });
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(vendor_addr);

        const txParams = {
          from: vendor_addr,
          to: CONTRACT_ADDR,
          data: txData,
          gas,
          gasPrice,
          nonce,
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          vendor_key
        );
        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        console.log("Transaction receipt:", receipt);
      } catch (error) {
        console.log("Transaction Error while buying ticket:",error.message);
        throw new Error("Transaction Error while transfering ticket");
      }
  };
}


// ContractCalls.createTicket(102,"0x43e9306b3a2a5C44Ad92A9d9Bb251F1b5fdfD89d");
// ContractCalls.buyTicket("0xd731b5553205e5dc146002a902498322a55dee4d684681cff118b49145cd03d8","0x43e9306b3a2a5C44Ad92A9d9Bb251F1b5fdfD89d",1,"0x33245bdc311dafF1F3CF144055f39F8eC60fDffA");