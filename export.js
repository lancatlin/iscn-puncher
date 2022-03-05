const { createObjectCsvWriter } = require('csv-writer');
const csvWriter = createObjectCsvWriter({
  path: 'out.csv',
  header: [
    { id: 'fromTime', title: 'From' },
    { id: 'toTime', title: 'To' },
    { id: 'duration', title: 'Duration (Minutes)' },
    { id: 'fromId', title: 'From ISCN' },
    { id: 'toId', title: 'To ISCN' },
  ],
});

function format(records) {
  return records.map(({ 
    fromTime,
    toTime,
    duration,
    fromId,
    toId,
  }) => {
    const date = new Date(0);
    date.setMinutes(duration);
    return {
      fromTime: fromTime.toLocaleString('zh-TW'),
      toTime: toTime.toLocaleString('zh-TW'),
      duration: date.toUTCString().slice(17, 22),
      fromId,
      toId,
    }
  });
}

async function writeRecords(records) {
  console.log(format(records));
  await csvWriter.writeRecords(format(records));
}

module.exports = {
  writeRecords,
}
