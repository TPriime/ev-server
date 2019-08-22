import crypto from 'crypto'; //Built-in encryption module
import secrets from './ENV.json'

export const encryptPassword = userPassword => {
    const key = crypto.createCipher(secrets.keyOne, secrets.keyTwo);
    let encryptedPassword = key.update(userPassword, secrets.charset, secrets.base);
    encryptedPassword += key.final(secrets.base);

    return encryptedPassword;
}

export const decryptPassword = encryptedUserPassword => {
    const key = crypto.createDecipher(secrets.keyOne, secrets.keyTwo);
    let decryptedPassword = key.update(encryptedUserPassword, secrets.base, secrets.charset);
    decryptedPassword += key.final(secrets.charset);

    return decryptedPassword;
}

export const hashPassword = userPassword => {
    const encryptedPassword = crypto.createHash('sha256').update(userPassword).digest(secrets.base);

    return encryptedPassword;
}