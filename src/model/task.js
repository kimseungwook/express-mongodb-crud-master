const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getCurrentDate(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let today = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  // let milliseconds = date.getMilliseconds();
  // return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
  return new Date(Date.UTC(year, month, today, hours, minutes, seconds));
}

const TaskSchema = new Schema({
  memberid: String,
  coursecode: String,
  lecturecode: String,
  pos: String,
  tm: String,
  pos_type: String,
  rate: String,
  lecturetime: String,
  viewtime: {
    String,
    default: 0
  },
  ip: String,
  device: String,
  viewdate: {
    type: Date,
    default: getCurrentDate
  },
});

  module.exports = mongoose.model('aqua-play-info', TaskSchema);



