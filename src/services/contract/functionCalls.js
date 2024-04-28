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

}


export default class ContractCalls {
  static createTicket = async (ticketAmt, vendorAddr) => {
    const privateKey = Constants.OWNER_PVT_KEY; 
    const fromAddress = Constants.OWNER_ADDR;
    
      try {
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

        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        const dLogs = decodeLogs(receipt);
        return dLogs[0]._ticketId;
      } catch (error) {
        console.log("Transaction Error:",error.message);
        throw new Error("Transaction Error while creating ticket");
      }
  };

  static buyTicket = async (vendor_key,vendor_addr,ticketId, buyerAddr) => {
      try {
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

        const signedTx = await web3.eth.accounts.signTransaction(
          txParams,
          vendor_key
        );
        // txn receipt
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
      } catch (error) {
        console.log("Transaction Error while buying ticket:",error.message);
        throw new Error("Transaction Error while transfering ticket");
      }
  };
}

