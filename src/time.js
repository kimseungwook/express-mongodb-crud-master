const config = {
    user: 'websa',
    password: 'wltmznf!@#$',
    server: '211.233.62.23', // You can use 'localhost\\instance' to connect to named instance
    database: 'player'
}

const sql = require('mssql');
var express = require("express");
const http = require('http');
const url = require('url');
var qs = require('querystring');

var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended : false }));

http.createServer(function(req, res){

    const uri = req.url;
    const query = url.parse(uri, true).query;
    const course_code = query.course_code;
//const lecture_code = query.lecture_code;
    const member_id = query.member_id;
    const idx = query.idx;

    const TM = query.TM;
    let pos_type = "";
    let pos = "";
    let rt = "";
    let cid = "";
    let cidArr = "";
//var pos_type = req.body.pos_type;
    const cd = query.cd;
    let lecture_code = "";
    let indexid = "";


    req.on( 'data' , function(chunck){
        var data = qs.parse(chunck.toString());
//console.log("11"+data.pos);
        pos_type = data.pos_type;
//console.log(pos_type);
        pos = data.pos;
        rt = data.rt;
        cid = data.cid;

        if ( rt == "undefined")
        {
            rt =0
        }

        if ( rt >= 1000)
        {
            rt = rt / 1000;
            rt = Math.ceil(rt);
        }

        cidArr = cid.split("_");
        lecture_code = cidArr[0];
        indexid = cidArr[1];
        indexid = indexid.replace("<CR><LF>","");
    })


    if (pos_type == 0 || pos_type == "progress" || pos_type == "done")
    {
        var setTimes = function() {
            var conn = new sql.ConnectionPool(config);
            conn.connect().then(function(conn) {
                var request = new sql.Request(conn);
                //console.log(indexid);

                if(indexid == ""){
                    indexid = idx;

                    if(indexid == ""){
                        indexid = 1153766;
                    }
                }

                if ( !pos || pos == "undefined" || pos == null)
                {
                    pos == 0
                }

                request.input('uIdx', sql.Int, indexid);
                request.input('upos', sql.VarChar, pos);
                request.input('uTM', sql.VarChar, rt);

                //request.output('uVT', sql.VarChar);


                request.execute('node_aquan_view_idx3').then(function(err, recordsets, returnValue, affected, result) {

                    //console.log(lecture_code+"|"+indexid+"|"+pos+"|"+pos_type+"|"+rt);
                    // console.dir(err);

                }).catch(function(err) {
                    // console.log(err);
                });
            });
        }

        setTimes();


    }
    res.end();

}).listen(3000, function(){
    console.log('server running on 3000.');

});

