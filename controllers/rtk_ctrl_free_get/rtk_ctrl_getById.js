const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports = function rtk_ctrl_getById(O = {}, rq, res) {
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let S_Get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';

    console.log('S_Get split: ');
    console.log(S_Get);
    connectRethinkdb()
        .then((_) => {
            r.db(S_Get[0])
                .table(S_Get[1])
                .get(S_Get[2])
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
        .catch((e) =>
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
            )
        )

    /**
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let S_Get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';

    console.log('S_Get split: ');
    console.log(S_Get);
    connectRethinkdb()
        .then((_) => {
            r.db(S_Get[0])
                .table(S_Get[1])
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