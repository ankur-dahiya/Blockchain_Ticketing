import {web3} from "../../web3/web3.js";

export default class Web3Helper {
    static createWallet = ()=>{
        const {address,privateKey} = web3.eth.accounts.create();
        return {publicAddress:address,privateKey};
    }
}