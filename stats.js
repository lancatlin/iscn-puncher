const moment = require('moment');

function stats(records) {
  const result = [];
  let week = moment();
  let workTime = 0;
  for (const record of records) {
    console.log(record);
    const beginOfWeek = moment(moment.unix(record.start)).startOf('week');
    if (!week.isSame(beginOfWeek)) {
      result.push({ week, workTime, })
      week = beginOfWeek;
      workTime = 0;
    }
    workTime += record.duration;
  }

  return result;
}

module.exports = stats;
