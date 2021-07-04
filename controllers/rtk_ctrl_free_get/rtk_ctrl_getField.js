const { rtk_ctrl_stuffs } = require("./rtk_ctrl_stuffs");
const r = require('rethinkdb');

module.exports = function rtk_ctrl_getField(O,rq, res) {
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let S_Get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    //let S_Get_split_length = S_Get.length;
    console.log('S_Get split: ');
    console.log(S_Get);
    if (S_Get[2].startsWith('getField__')) {
        // ie: http://localhost:8181/go/users/getField__email
        S_Get[2] = S_Get[2].replace('getField__', '')
        connectRethinkdb()
            .then((_) => {
                r.db(S_Get[0])
                    .table(S_Get[1])
                    .getField(S_Get[2])
                    .run(_, function (err, cursor) {
                        if (err) {
                            return res.end(
                                JSON.stringify(
                                    Object.assign({ valid: "no", what: "error case 3-0" }, err)
                                )
                            );
                        }
                        if (cursor) {
                            cursor.toArray(function (err, result) {
                                if (err) {
                                    res.end(
                                        JSON.stringify(
                                            Object.assign({ valid: "no", what: "error case 3-1 " }, err)
                                        )
                                    ); return;
                                }
                                res.end(JSON.stringify(result, null, 2));
                                return;
                            });
                        }
                    })
            })
            .catch((e) =>
                res.end(
                    JSON.stringify(Object.assign({ valid: "no", what: "error final case 3-catch" }, e))
                )
            )
    }
    /**
    if (["filter", "f", "fi"].includes(S_Get[2].split("___")[0])) {
        // ie:http://localhost:8181/go/users/f___nom___dola
        let S_Get_filter = S_Get[2].split("___").filter((_, i) => i !== 0)
        console.log("S_Get_filter:"); console.log(S_Get_filter);
        connectRethinkdb()
            .then((_) => {
                r.db(S_Get[0])
                    .table(S_Get[1])
                    .filter(
                        r.row(S_Get_filter[0]).eq(S_Get_filter[1]), { default: true }
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
                            res.end(JSON.stringify(result, null, 2));
                            //process.exit(1);)
                        });
                    });
            })
            .catch((e) =>{
                console.log("error final :"); console.log(e);
                return res.end(
                    JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
                )
           } )
        
        }
        **/
}