const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // The secret key
const iv = crypto.randomBytes(16); // The initialization vector

function encrypt(obj) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const text = JSON.stringify(obj);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt({ iv = iv, encryptedData }) {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
    try {
        return JSON.parse(decrypted.toString());
    } catch (e) {
        return { error: 'Invalid hash', data: decrypted.toString() };
    }
}

const objectToEncrypt = {
    name: 'John Doe',
    age: 32,
    birthday: new Date(1980, 1, 1),
    address: ["123 Main St", "Anytown", "CA", "90210"],
    friends: {
        "jane": "doe",
        "joe": "doe",
        "jill": "doe"
    }
};

console.log('Original object:', objectToEncrypt);
const encrypted = encrypt(objectToEncrypt);
console.log('Encrypted object:', encrypted);
const decrypted = decrypt(encrypted);
console.log('Decrypted object:', decrypted);