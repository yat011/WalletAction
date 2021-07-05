
import Web3 from "web3";
import { getWallet, readSecret } from "./auth";
import { getContractHelper, Token } from "./contract/erc20Util";
require('dotenv').config();

const BNB_RPC_URL = "https://bsc-dataseed.binance.org/";
const pancakeProxy = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const fs = require("fs")


async function main() {
    const wallet = await getWallet();
    const web3Client = new Web3(BNB_RPC_URL);


    const address = wallet.getAddressString()
    console.log("Address " + address);

    // const busdHelper = getContractHelper(wallet, web3Client, Token.busd)
    // const usdcHelper = getContractHelper(wallet, web3Client, Token.usdc)
    // await busdHelper.approveIfNonZero(pancakeProxy);
    // await usdcHelper.approveIfNonZero(pancakeProxy);

    const exportPassword = await readSecret("export pwd");
    wallet.toV3(exportPassword).then(value => {
        // const address = account.getAddress().toString('hex')
        // const file = `UTC--${new Date().toISOString().replace(/[:]/g, '-')}--${address}.json`
        fs.writeFileSync("./temp_keystore.json", JSON.stringify(value))
    });


}





main();