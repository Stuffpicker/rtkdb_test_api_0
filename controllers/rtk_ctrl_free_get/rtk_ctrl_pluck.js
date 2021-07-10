const r = require('rethinkdb');
const { rtk_ctrl_stuffs } = require('./rtk_ctrl_stuffs');
module.exports = function rtk_ctrl_pluck(O = { cluster_url: ["192.168.1.110", "192.168.1.110"], q_get: "", u_get:""},rq,res){
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile    
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let url_split = rq.url.split('?');
    let { q_get, u_get}=O; console.log('q_get: ', q_get, rq.url)
   /* let q_get = url_split[1]
    
    let u_get = url_split[0].endsWith('/') ?
        url_split[0].substring(1).substring(url_split[0].length - 2, 0).split("/") :
        url_split[0].substring(1).split("/");*/
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    let u_get_split_length = u_get.length;
    console.log('u_get split: ');
    console.log(u_get);
    let whatPluck = u_get[2].split("___")[0];
    if (["pluck", "p", "plk", "pluckcount", "pcount", "plkcount"].includes(u_get[2].split("___")[0])) {
        // ie:http://localhost:8181/go/users/pluck___nom___email
       let u_get_pluck = u_get[2].split("___").filter((_, i) => i !== 0)
        console.log('u_get_pluck')
        console.log(u_get_pluck)
        let xxx = " table(u_get[1]).pluck(u_get_pluck)"
        connectRethinkdb(O?.cluster_url)
            .then((_) => {                
                let zzz =()=>{
                    return r.db(u_get[0])
                        .table(u_get[1]).without(["inputPassword4", "mobilephone"])
                    };
                    //if (whatPluck.endsWith('count')){return ()=>zzz().count()}
                zzz().pluck(u_get_pluck)
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
                            q_get.includes('?count')?result= result.length:"";console.log(result)
                            res.end(JSON.stringify(result, null, 2));
                            //process.exit();
                        });
                    });
            })
            .catch((e) =>{
                if (e?.msg?.includes("192.168.1.110")) {
                    rtk_ctrl_pluck(O = { cluster_url: ["192.168.1.109", "192.168.1.109"] }, rq, res)
                    return;
                }
                if (e?.msg?.includes("192.168.1.109")) {
                    rtk_ctrl_pluck(O = { cluster_url: ["192.168.1.110", "192.168.1.110"] }, rq, res)
                    return;
                }
                res.end(JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e)));
                //process.abort();
            }) 
        

    }
}