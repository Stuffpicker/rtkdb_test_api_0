const r = require('rethinkdb')

module.exports.rtk_ctrl_stuffs = { sec_ch_ua_mobile, connectRethinkdb}
function sec_ch_ua_mobile(rh) { let t = rh; return t[t.indexOf('sec-ch-ua-mobile') + 1] }

function connectRethinkdb(rethinkhost = ["192.168.1.110", "192.168.1.106"]) {
    let connection = null;
    return Promise.resolve(
        r.connect(
            { host: rethinkhost[0], port: 28015,user:"admin",password:"fola" },
            function (err, conn) {
                if (err) connection = err;
                if (conn) connection = conn;
                return connection;
            }
        )
    );
}