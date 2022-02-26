import dotenv from 'dotenv';
dotenv.config();

const { MNEMONIC } = process.env;
console.log(MNEMONIC);
