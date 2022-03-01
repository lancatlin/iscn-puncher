const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const MNEMONIC = process.env["MNEMONIC"];
const ENDPOINT = process.env["ENV"] === "PROD"
  ? process.env["MAINNET"]
  : process.env["TESTNET"]

async function loadWallet() {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
  const [wallet] = await signer.getAccounts();
  return { signer, wallet };
}

module.exports = { loadWallet, ENDPOINT };
