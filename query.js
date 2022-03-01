const { ISCNQueryClient } = require("@likecoin/iscn-js");
const { loadWallet, ENDPOINT } = require("./wallet");

const client = new ISCNQueryClient();

async function query(
  startFrom = new Date("2022-02-27T12:40:00+08:00"),
  until = new Date(),
) {
  const { wallet } = await loadWallet();
  await client.connect(ENDPOINT);
  const { records } = await client.queryRecordsByOwner(wallet.address);
  for (const record of records) {
    const timestamp = new Date(record.data.recordTimestamp);
    console.log(
      timestamp,
      startFrom.valueOf() < timestamp.valueOf() &&
        timestamp.valueOf() < until.valueOf()
    );
  }
  console.log(startFrom, until);
}

module.exports = {
  query,
};
