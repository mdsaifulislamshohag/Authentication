const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

export function getRandomNumber() {
    return Math.floor(Math.random() * 9000000000) +
        1000000000;
}

