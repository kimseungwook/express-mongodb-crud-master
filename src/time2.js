const config = {
    user: 'websa',
    password: 'wltmznf!@#$',
    server: '211.233.62.23', // You can use 'localhost\\instance' to connect to named instance
    database: 'player'
}

const sql = require('mssql');
const http = require('http');
const url = require('url');

http.createServer(function(req, res){

    const uri = req.url;
    const query = url.parse(uri, true).query;
    const course_code = query.course_code;
    const lecture_code = query.lecture_code;
    const member_id = query.member_id;
    const idx = query.idx;
    const pos = query.pos;
    const TM = query.TM;
    const pos_type = query.pos_type;


    if ( cd == "mob")
    {
        var RT = null;

        RT = query.RT;

        if ( RT == "undefined")
        {
            RT =0
        }

        if ( RT >= 1000)
        {
            RT = RT / 1000;
            RT = Math.ceil(RT);
        }
    }
    /*
    if(PT >= 200){
    PT = 1;
    }
    */
    if (pos_type == 0 || pos_type == "progress" || pos_type == "done")
    {
        var setTimes = function() {
            var conn = new sql.ConnectionPool(config);
            conn.connect().then(function(conn) {
                var request = new sql.Request(conn);
                request.input('uIdx', sql.Int, idx);
                request.input('upos', sql.VarChar, pos);
                if ( cd == "web"){
                    request.input('uTM', sql.VarChar, TM);
                }else{
                    request.input('uTM', sql.VarChar, RT);
                }
                //request.output('uVT', sql.VarChar);
                request.execute('node_aquan_view_idx2').then(function(err, recordsets, returnValue, affected, result) {

                    console.log(member_id+"|"+course_code+"|"+lecture_code+"|"+idx+"|"+pos+"|"+TM+"|"+cd);
                    console.dir(err);

                }).catch(function(err) {
                    console.log(err);
                });
            });
        }
        setTimes();    }
    res.end();

}).listen(7021, function(){
    console.log('server running on 7021.');

});
