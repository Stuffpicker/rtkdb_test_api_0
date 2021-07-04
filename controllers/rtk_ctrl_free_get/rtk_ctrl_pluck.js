const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports = function rtk_pluck(rq,res){ 
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile    
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let S_Get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    let S_Get_split_length = S_Get.length;
    console.log('S_Get split: ');
    console.log(S_Get);
    if (["pluck", "p", "plk"].includes(S_Get[2].split("___")[0])) {
        // ie:http://localhost:8181/go/users/pluck___nom___email
       let S_Get_pluck = S_Get[2].split("___").filter((_, i) => i !== 0)
        console.log('S_Get_pluck')
        console.log(S_Get_pluck)
        connectRethinkdb()
            .then((_) => {
                r.db(S_Get[0])
                    .table(S_Get[1])
                    .pluck(
                        S_Get_pluck
                    )
                    .run(_, function (err, cursor) {
                        if (err) {
                            res.end(
                                JSON.stringify(
                                    Object.assign({ valid: "no", what: "error 1-6-0" }, err)
                                )
                            );
                        }
                        cursor.toArray(function (err, result) {
                            if (err) {
                                res.end(
                                    JSON.stringify(
                                        Object.assign({ valid: "no", what: "error 1-7-0" }, err)
                                    )
                                );
                            }
                            console.log(process.memoryUsage())
                            res.end(JSON.stringify(result, null, 2));
                            //process.exit();
                        });
                    });
            })
            .catch((e) =>{
                res.end(JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e)));
                //process.abort();
            }) 
        

    }
}