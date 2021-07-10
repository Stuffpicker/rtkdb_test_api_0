const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports = function rtk_ctrl_getById(O = { cluster_url: ["192.168.1.110", "192.168.1.109"] }, rq, res) {
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let { q_get, u_get } = O; console.log('q_get: ', q_get, rq.url)
   /* let u_get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: '); */
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';

    console.log('u_get split: ');
    console.log(u_get);
    connectRethinkdb(O?.cluster_url)
        .then((_) => {
            r.db(u_get[0])
                .table(u_get[1])
                .get(u_get[2])
                .run(_, function (err, result) {
                    if (err) {
                        res.end(
                            JSON.stringify(
                                Object.assign({ valid: "no", what: "error case 3-else" }, err)
                            ),
                            null,
                            2
                        );
                    }
                    res.end(JSON.stringify(result, null, 2));
                    //process.exit(1);  
                })
        })
        .catch((e) =>{
            if (e?.msg?.includes("192.168.1.110")) {
                rtk_ctrl_getById(O = { cluster_url: ["192.168.1.109", "192.168.1.109"] }, rq, res)
                return;
            }
            if (e?.msg?.includes("192.168.1.109")) {
                rtk_ctrl_getById(O = { cluster_url: ["192.168.1.110", "192.168.1.110"] }, rq, res)
                return;
            }
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "Error final" }, e))
            )}
        )

    /**
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let u_get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';

    console.log('u_get split: ');
    console.log(u_get);
    connectRethinkdb()
        .then((_) => {
            r.db(u_get[0])
                .table(u_get[1])
                .run(_, function (err, cursor) {
                    if (err) {
                        return res.end(
                            JSON.stringify(
                                Object.assign({ valid: "no", what: "error case 2-0" }, err)
                            )
                        );
                    }
                    if (cursor) {
                        cursor.toArray(function (err, result) {
                            if (err) {
                                res.end(
                                    JSON.stringify(
                                        Object.assign({ valid: "no", what: "error case 2-1 " }, err)
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
                JSON.stringify(Object.assign({ valid: "no", what: "error case 2-catch final" }, e))
            )
        );
        **/
}