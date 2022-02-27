import { ISCNQueryClient } from "@likecoin/iscn-js";

const client = new ISCNQueryClient();

async function main() {
  await client.connect("http://node.testnet.like.co/rpc/");
  const res = await client.queryRecordsByOwner(
    "cosmos1ututsjcj6l9a04ue68zfm07kpuxrxn674c809w"
  );
  console.dir(res, { depth: null });
}

main();
