const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports = function rtk_ctrl_tableList(O = { cluster_url: ["192.168.1.110", "192.168.1.109"]},rq,res){
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
            //console.log("le _ :"); console.log(_);
            r.db(u_get[0])
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
        .catch((e)=>{
            if (e?.msg?.includes("192.168.1.110")){
                rtk_ctrl_tableList(O = { cluster_url: ["192.168.1.109", "192.168.1.109"]}, rq, res)
                return;
            } 
            if (e?.msg?.includes("192.168.1.109")) {
                rtk_ctrl_tableList(O = { cluster_url: ["192.168.1.110", "192.168.1.110"] }, rq, res)
                return;
            }
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "error case 1-1 final" }, e))
            )}
        );
}