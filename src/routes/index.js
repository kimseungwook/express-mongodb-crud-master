
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
const router = express.Router(undefined);
const Task = require('../model/task');
// const { EJSON } = require('bson');

router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.render('index', {
    tasks
  });
});

router.post('/add', async (req, res, next) => {
  const task = new Task(req.body);
  await task.save();
  res.redirect('/');
});

router.get('/add/:memberid/:coursecode/:lecturecode/:apos/:tm/:pos_type/:rate/:lecturetime/:viewtime/:ip/:device', async (req, res, next) => {
  let { memberid } = req.params;
  let { coursecode } = req.params;
  let { lecturecode } = req.params;
  let { apos } = req.params;
  let { tm} = req.params;
  let { pos_type } = req.params;
  let { rate } = req.params;
  let { lecturetime } = req.params;
  // let { viewtime } = req.params;
  let { ip } = req.params;
  let { device } = req.params;
  let ftask = await Task.findOne()
      .where('memberid').equals(memberid)
      .where('lecturecode').equals(lecturecode)
      .sort('-viewdate')
      .limit(1)
      .select({pos:1,_id:0})

  let pvos = "";
  let vpos = "";
  try {
    // let bpos = EJSON.parse(pos);
    console.log('ftask='+vpos+ "\n");
    pvos = ftask.toString().replace('pos', '"pos"');
    pvos  = pvos.replace(/'/g,"" );
    const  posObj = JSON.parse(pvos);
    vpos = apos - posObj.pos;
  }catch(err){
    vpos =0
  }
  // let bpos = EJSON.parse(pos);

  vpos = Math.abs(vpos);
  const task = await Task.create({memberid:memberid,coursecode:coursecode,lecturecode:lecturecode,pos:apos,tm:tm,pos_type:pos_type,rate:rate,lecturetime:lecturetime,viewtime:vpos,ip:ip, device:device})

  await task.save();
  res.redirect('/');
});


router.get('/add2/:ordercode/:memberid/:coursecode/:lecturecode/:apos/:tm/:pos_type/:rate/:lecturetime/:ip/:device', async (req, res, next) => {
  let { ordercode } = req.params;
  let { memberid } = req.params;
  let { coursecode } = req.params;
  let { lecturecode } = req.params;
  let { apos } = req.params;
  let { tm} = req.params;
  let { pos_type } = req.params;
  let { rate } = req.params;
  let { lecturetime } = req.params;
  let { viewtime } = req.params;
  let { ip } = req.params;
  let { device } = req.params;

  function getCurrentDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let today = date.getDate();
    let hours = date.getHours()+9;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    // let milliseconds = date.getMilliseconds();
    // return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds));
  }

  let Aqua;
  try{
    Aqua = mongoose.model('aqua-' + coursecod);
  }catch(e){
    Aqua = mongoose.model('aqua-' + coursecode, new Schema({
          ordercode: String,
          memberid: String,
          coursecode: String,
          lecturecode: String,
          pos: Number,
          tm: Number,
          pos_type: Number,
          rate: Number,
          lecturetime: Number,
          // viewtime:{
          //   String,
          //   default: 0
          // },
          viewtime : Number,
          ip: String,
          device: String,
          // viewdate: {
          //   type: Date,
          //   default: getCurrentDate()
          // },
          viewdate: Date,
        })
    );
  }

  let ftask = await Aqua.findOne()
      .where('memberid').equals(memberid)
      .where('lecturecode').equals(lecturecode)
      .sort('-viewdate')
      // .limit(1)
      .select({tm:1,viewtime:1,viewdate:1,_id:0})

  // let pvos = "";
  let ntm = 0;
  let lvt = 0;
  // let pvos = "";
  try {
    // let bpos = EJSON.parse(pos);
    // console.log(ftask);
    // const vvv = mparser.parseFilter((ftask.toString()));
    const eJon = JSON.stringify(ftask);
    console.log(eJon);

    const aquaObj = JSON.parse(eJon);
    // console.log('vpos='+aquaObj.count+ "\n");
    console.log("atm="+aquaObj.tm);
    console.log("tm="+tm);
    ntm = Number(tm) - Number(aquaObj.tm);
    console.log("ntm="+ntm);
    let signTm = Math.sign(ntm)
    console.log("signTm="+signTm);
    if(signTm == -1){
      // if(ntm > -10) {
      //   lvt =  tm - Number(aquaObj.tm);
      //   const mvt = Math.abs(lvt);
      //   lvt = Number(aquaObj.viewtime)  + mvt;
      // }else{
      //   lvt = Number(aquaObj.viewtime) + 10;
      // }
      lvt =  Number(aquaObj.viewtime) + Number(tm);
    }else {
      lvt = Number(aquaObj.viewtime) +  Number(ntm);
    }

    console.log('lvt='+lvt+ "\n");
    // vpos = Math.abs(vpos);

  }catch(err){
    lvt ='0'
  }
  // vpos = Math.abs(vpos);

  const doc = new Aqua({
    ordercode: ordercode,
    memberid: memberid ,
    coursecode: coursecode,
    lecturecode: lecturecode,
    pos: apos ,
    tm: tm,
    pos_type: pos_type,
    rate: rate,
    lecturetime: lecturetime,
    viewtime: lvt,
    ip: ip,
    device: device ,
    viewdate: getCurrentDate()
  });

  await doc.save(function(err) {
    if (err) throw err;
    console.log('aqua saved successfully!');
  });


  // await res.redirect('/add2/f/2/3/2/1/no/1.8/n/0/211.48.77.122/PC');
  // await res.redirect('/');
  await res.end();
});

router.get('/ccreate/:memberid/:coursecode/:lecturecode', async (req, res, next) => {
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
  let {memberid} = req.params;
  let {coursecode} = req.params;
  let {lecturecode} = req.params;
  try{
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

    const Aqua =  mongoose.model('aqua-play-info' + memberid + '-' + coursecode + '-' + lecturecode, TaskSchema);
    Aqua.createCollection().then(function (collection) {
      console.log("Collection Create success");
    });
  } catch(e){
    console.log("Collection Create error");
  }
  res.redirect('/');
});

router.get('/turn/:id', async (req, res, next) => {
  let { id } = req.params;
  const task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect('/');
});



router.get('/edit/:id', async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  console.log(task)
  res.render('edit', { task });
});

router.post('/edit/:id', async (req, res, next) => {
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/');
});

router.get('/delete/:id', async (req, res, next) => {
  let { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/');
});


module.exports = router;
