import * as CryptoJS from 'crypto-js';

export function decryptMessage(encryptedMessage: string, passphrase: string): string {
    const key = CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Hex.parse('736f6d655f636f6e7374616e745f73616c74'), {
        keySize: 256 / 32,
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
    });

    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}




