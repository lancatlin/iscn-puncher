const { ISCNQueryClient, ISCNSigningClient } = require("@likecoin/iscn-js");
const { SigningStargateClient } = require("@cosmjs/stargate");
const { loadWallet } = require("./wallet");

const NAME = process.env["NAME"];
const PUNCH_IN = "Punch in";
const PUNCH_OUT = "Punch out";

function formatDate(date) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

async function sign(action) {
  const { signer, wallet } = await loadWallet();
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
  };
  console.dir(payload, { depth: null });
  const res = await signingClient.createISCNRecord(wallet.address, payload);
  console.log(res);
  const iscnID = await client.queryISCNIdsByTx(res.transactionHash);
  console.log(iscnID);
}

module.exports = {
  sign,
  PUNCH_IN,
  PUNCH_OUT,
};
