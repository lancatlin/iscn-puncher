import { ISCNQueryClient } from "@likecoin/iscn-js";

const client = new ISCNQueryClient();

async function main() {
  await client.connect("http://node.testnet.like.co/rpc/");
  const res = await client.queryRecordsByOwner(
    "cosmos170d84tujgds00qcckxmd3jv0p222c4909rn7yg"
  );
  console.dir(res, { depth: null });
}

main();
