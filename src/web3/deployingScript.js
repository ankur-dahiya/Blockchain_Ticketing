// sepolia testnet: https://sepolia.infura.io/v3/
// sepolia chainId: 11155111
// https://sepolia.etherscan.io

import { readFileSync } from "fs";
import { web3 } from "./web3.js";
import path from "path";
import solc from "solc";
import { deployContract } from "../helper/contract/deployFunction.js";

const contractFiles = ["./smart_contracts/ticketContract.sol"];

const sources = {};

for (let contractPath of contractFiles) {
  const fileName = path.basename(contractPath, ".sol");
  sources[fileName] = {
    content: readFileSync(contractPath, "utf-8"),
  };
}

let input = {
  language: "Solidity",
  sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))); //output should be in JSON format so parse the output in json

// get abi and bytecode after comiplation
export const CONTRACT_ABI = output.contracts["ticketContract"]["Ticket"].abi;
export const CONTRACT_BYTECODE = output.contracts["ticketContract"]["Ticket"].evm.bytecode.object;
console.log("**************CONTRACT ABI**********************")
console.log(JSON.stringify(CONTRACT_ABI));
console.log("**************CONTRACT ABI**********************")
// deploying and creating the instance of the contract
await deployContract();
console.log("contract deployed...now copy the ABI, Contract address and paste in src/web3/contract.js")
