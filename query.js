const { ISCNQueryClient } = require("@likecoin/iscn-js");
const { loadWallet, ENDPOINT } = require("./wallet");
const { PUNCH_IN, PUNCH_OUT } = require("./sign");

const client = new ISCNQueryClient();

async function query() {
  const { wallet } = await loadWallet();
  await client.connect(ENDPOINT);
  const { records } = await client.queryRecordsByOwner(wallet.address);
  console.log(organize(records));
}

function organize(records) {
  const result = [];
  let last = null;
  for (const record of records) {
    const timestamp = new Date(record.data.recordTimestamp);
    const { keywords } = record.data.contentMetadata;
    if (keywords === PUNCH_IN && !last) {
      last = record;
    }
    if (keywords === PUNCH_OUT && last) {
      result.push(commit(last, record));
      last = null;
    }

    console.log(
      keywords, timestamp,
    );
  }
  return result;
}

function commit(recordIn, recordOut) {
  const fromTime = new Date(recordIn.data.recordTimestamp);
  const toTime = new Date(recordOut.data.recordTimestamp);
  const duration = toTime.getTime() - fromTime.getTime();
  const minutes = Math.ceil(duration / (1000 * 60));
  return {
    fromTime,
    fromId: recordIn.data['@id'],
    toTime,
    toId: recordOut.data['@id'],
    duration: minutes,
  };
}

module.exports = {
  query,
};
