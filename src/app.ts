
import Web3 from "web3";
import { getWallet } from "./auth";
import { getContract, Token } from "./contract/erc20Util";
require('dotenv').config();

const BNB_RPC_URL = "https://bsc-dataseed.binance.org/";
async function main() {
    const wallet = await getWallet();
    const web3Client = new Web3(BNB_RPC_URL);


    const address = wallet.getAddressString()
    console.log("Address " + address);

    const usdcContract = getContract(web3Client, Token.busd);
    usdcContract.methods.balanceOf(address).call((err: any, balance: any) => {
        console.log({ err, balance })
    });


}




main();