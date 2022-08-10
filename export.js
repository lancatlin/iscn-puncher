const moment = require("moment");
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';
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
const statsWriter = createObjectCsvWriter({
  path: 'stats.csv',
  header: [
    { id: 'week', title: 'Start' },
    { id: 'workTime', title: 'Work Time (HH:mm)' },
  ],
});

function formatDuration(duration) {
  const m = moment.utc(1000 * duration)
  return m.format("HH:mm");
}

function hours(seconds) {
  return Math.round(seconds / 3600);
}

function format(records) {
  return records.map(({ 
    start,
    end,
    duration,
    startISCN,
    endISCN,
  }) => {
    return {
      start: moment.unix(start).format(DATE_TIME_FORMAT),
      end: moment.unix(end).format(DATE_TIME_FORMAT),
      duration: formatDuration(duration),
      startISCN,
      endISCN,
    }
  });
}

function formatStats(weeks) {
  return weeks.map(({ week, workTime }) => ({
    week: week.format(DATE_FORMAT),
    workTime: hours(workTime)
  }))
}

async function writeRecords(result) {
  console.log(format(result.records));
  console.log(formatStats(result.stats));
  await csvWriter.writeRecords(format(result.records));
  await statsWriter.writeRecords(formatStats(result.stats));
}

module.exports = {
  writeRecords,
}
