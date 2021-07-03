import Wallet, { hdkey } from 'ethereumjs-wallet';
import read from 'read';
import { generateMnemonic, mnemonicToSeed } from 'bip39';

const crypto = require('crypto');

export async function getWallet() {
    const version = parseInt(await readNormal("Version:"));
    const password = await getSecret("Password");
    const passphase = await getSecret("Passphase");

    const mnemonic = await getMnemonic(password, version);
    const wallet = await getWalletFromMnemonic(mnemonic, passphase)
    return wallet;
}


async function getSecret(prompt: string) {
    const secret = await readSecret(prompt);
    const resecret = await readSecret("Re" + prompt);
    if (secret !== resecret) {
        throw Error("Not Equal");
    }
    return secret
}


async function readSecret(prompt: string): Promise<string> {
    return readInput(prompt, true)
}

async function readNormal(prompt: string): Promise<string> {
    return readInput(prompt, false)
}


async function readInput(prompt: string, silent: boolean): Promise<string> {

    return new Promise((resolve, reject) => {
        read({ prompt: prompt, silent: silent }, function (err: any, password: string) {
            if (err) {
                reject(err);
                return;
            }
            resolve(password);
        });
    });
}

async function getMnemonic(password: string, version: number): Promise<string> {

    const customSHABytes = function (numBytes: number) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const final_bytes = hash.copy().digest('buf');
        const cutted_final_bytes = final_bytes.slice(0, numBytes);
        return cutted_final_bytes;
    }

    const customPBKDF2 = async function (): Promise<Buffer> {

        return new Promise((resolve, reject) => {
            const iteration = process.env['SEED_ITERATION'];
            if (!iteration) {
                reject();
            }
            crypto.pbkdf2(password, process.env['SEED_SALT'],
                parseInt(iteration as string),
                32,
                'sha512',
                (err: any, derivedKey: Buffer) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(derivedKey);
                })
        });
    }

    if (version == 1) {
        return generateMnemonic(128, customSHABytes);
    }

    if (version == 2) {
        const seed = await customPBKDF2();
        return generateMnemonic(128, (numBytes: number) => {
            return seed;
        });
    }

    throw Error("Undefined version");
}

async function getWalletFromMnemonic(mnemonic: string, passphase: string): Promise<Wallet> {
    const seed = await mnemonicToSeed(mnemonic, passphase);
    const hdWallet = hdkey.fromMasterSeed(seed)
    const eth_key = hdWallet.derivePath("m/44'/60'/0'/0/0");
    return eth_key.getWallet();
}
