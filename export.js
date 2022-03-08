const moment = require("moment");
const { createObjectCsvWriter } = require('csv-writer');
const csvWriter = createObjectCsvWriter({
  path: 'out.csv',
  header: [
    { id: 'start', title: 'Start' },
    { id: 'end', title: 'End' },
    { id: 'duration', title: 'Duration (HH:mm)' },
    { id: 'startISCN', title: 'Start ISCN' },
    { id: 'endISCN', title: 'End ISCN' },
  ],
});

function format(records) {
  return records.map(({ 
    start,
    end,
    duration,
    startISCN,
    endISCN,
  }) => {
    return {
      start: start.format('YYYY-MM-DD HH:mm'),
      end: end.format('YYYY-MM-DD HH:mm'),
      duration: moment.utc(duration.as('milliseconds')).format('HH:mm'),
      startISCN,
      endISCN,
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
