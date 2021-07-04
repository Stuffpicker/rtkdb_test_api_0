const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports =function rtk_ctrl_tableList(O={},rq,res){
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
            //console.log("le _ :"); console.log(_);
            r.db(S_Get[0])
                .tableList()
                .run(_, function (err, result) {
                    if (err) {
                        return res.end(
                            JSON.stringify(
                                Object.assign({ valid: "no", what: "error case 1-0" }, err)
                            )
                        );
                    }
                    return res.end(
                        JSON.stringify(
                            [Object.assign(
                                { valid: "yes", what: "Table List" },
                                { result }),
                            ], null, 2
                        )
                    );
                })
        })
        .catch((e) =>
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "error case 1-1 final" }, e))
            )
        );
}