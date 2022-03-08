const moment = require('moment');

function stats(records) {
  const result = [];
  let week = moment();
  let workTime = moment.duration(0);
  for (const record of records) {
    console.log(record);
    const beginOfWeek = moment(record.start).startOf('week');
    if (!week.isSame(beginOfWeek)) {
      result.push({ week, workTime, })
      week = beginOfWeek;
      workTime = moment();
    }
    workTime.add(record.duration);
  }

  return result;
}

module.exports = stats;
