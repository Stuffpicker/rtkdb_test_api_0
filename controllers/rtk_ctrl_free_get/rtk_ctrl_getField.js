const { rtk_ctrl_stuffs } = require("./rtk_ctrl_stuffs");
const r = require('rethinkdb');

module.exports = function rtk_ctrl_getField(O = { cluster_url: ["192.168.1.110", "192.168.1.110"], q_get: "", u_get: "" },rq, res) {
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let { q_get, u_get } = O; console.log('q_get: ', q_get, rq.url)
   /* let u_get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: '); */
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    //let u_get_split_length = u_get.length;
    console.log('u_get split: ');
    console.log(u_get);
    if (u_get[2].startsWith('getField___')) {
        // ie: http://localhost:8181/go/users/getField__email
        u_get[2] = u_get[2].replace('getField___', '')
        connectRethinkdb()
            .then((_) => {
                r.db(u_get[0])
                    .table(u_get[1])
                    .getField(u_get[2])
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
    if (["filter", "f", "fi"].includes(u_get[2].split("___")[0])) {
        // ie:http://localhost:8181/go/users/f___nom___dola
        let u_get_filter = u_get[2].split("___").filter((_, i) => i !== 0)
        console.log("u_get_filter:"); console.log(u_get_filter);
        connectRethinkdb()
            .then((_) => {
                r.db(u_get[0])
                    .table(u_get[1])
                    .filter(
                        r.row(u_get_filter[0]).eq(u_get_filter[1]), { default: true }
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