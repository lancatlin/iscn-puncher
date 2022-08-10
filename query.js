const { ISCNQueryClient } = require("@likecoin/iscn-js");
const { loadWallet, ENDPOINT } = require("./wallet");
const { PUNCH_IN, PUNCH_OUT } = require("./sign");
const { writeRecords } = require("./export");
const moment = require("moment");
const stats = require("./stats");

const client = new ISCNQueryClient();

function getTime(record) {
  return moment(record.data.recordTimestamp).unix();
}

async function query() {
  const { wallet } = await loadWallet();
  await client.connect(ENDPOINT);
  const { records } = await client.queryRecordsByOwner(wallet.address);
  const result = organize(records);
  await writeRecords({
    stats: stats(result),
    records: result,
  });
}

function organize(records) {
  const result = [];
  let last = null;
  for (const record of records) {
    const timestamp = getTime(record);
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
  const start = getTime(recordIn);
  const end = getTime(recordOut);
  const duration = end - start;
  return {
    start,
    startISCN: recordIn.data['@id'],
    end,
    endISCN: recordOut.data['@id'],
    duration,
  };
}

module.exports = {
  query,
};
