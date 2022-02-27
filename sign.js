const { ISCNQueryClient, ISCNSigningClient } = require("@likecoin/iscn-js");
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient } = require("@cosmjs/stargate");
require("dotenv").config();

const MNEMONIC = process.env["MNEMONIC"];
const NAME = process.env["NAME"];
const PUNCH_IN = "Punch in";
const PUNCH_OUT = "Punch out";

function formatDate(date) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

async function sign(action) {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
  const [wallet] = await signer.getAccounts();
  console.log(wallet.address);

  const signingClient = new ISCNSigningClient();
  await signingClient.connectWithSigner(
    "http://node.testnet.like.co/rpc/",
    signer
  );
  const client = new ISCNQueryClient();
  await client.connect("http://node.testnet.like.co/rpc/");

  const payload = {
    stakeholders: [
      {
        entity: {
          "@id": wallet.address,
          name: NAME,
        },
        rewardProportion: 100,
        contributionType: "http://schema.org/author",
      },
    ],
    type: "Message",
    name: `${NAME} - ${action} - ${formatDate(new Date())}`,
    keywords: action,
  };
  console.log(payload);
  // const res = await signingClient.createISCNRecord(wallet.address);
  // console.log(res);
  // const iscnID = await client.queryISCNIdsByTx(res.transactionHash);
  // console.log(iscnID);
}

module.exports = sign;
