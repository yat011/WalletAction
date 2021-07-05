
import Wallet from "ethereumjs-wallet";
import Web3 from "web3";
const Tx = require("ethereumjs-tx").Transaction
import Common from 'ethereumjs-common'


export async function sendTransactionToContract(web3: Web3, wallet: Wallet, gasLimit: number,
    gasPrice: string, contractAddress: string, callMethod: any) {




    return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(wallet.getAddressString(), (err, txCount) => {

            const txObject = {
                nonce: web3.utils.toHex(txCount),
                from: wallet.getAddressString(),
                gasLimit: web3.utils.toHex(gasLimit), // Raise the gas limit to a much higher amount
                gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei')),
                to: contractAddress,
                data: callMethod.encodeABI()
            }
            const privateKey = wallet.getPrivateKey();


            const common = Common.forCustomChain('mainnet', {
                name: 'bnb',
                networkId: 56,
                chainId: 56
            }, 'petersburg');

            const tx = new Tx(txObject, { common: common })
            tx.sign(privateKey)

            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')

            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                console.log('err:', err, 'txHash:', txHash)
                if (err) {
                    reject(err);
                    return;
                }
                resolve(txHash);
            })
        })
    });
}
