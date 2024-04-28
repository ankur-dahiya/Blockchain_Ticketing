import {Web3} from "web3";
import Constants from "../constant/constants.js";

// export const web3 = new Web3("HTTP://127.0.0.1:7545");
export const web3 = new Web3(`https://sepolia.infura.io/v3/${Constants.INFURA_APPID}`);
