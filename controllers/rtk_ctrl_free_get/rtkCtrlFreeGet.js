const r = require("rethinkdb");
const rtk_ctrl_filter = require("./rtk_ctrl_filter");
const rtk_ctrl_getAllRows = require("./rtk_ctrl_getAllRows");
const rtk_ctrl_getById = require("./rtk_ctrl_getById");
const rtk_ctrl_getField = require("./rtk_ctrl_getField");
const rtk_ctrl_pluck = require("./rtk_ctrl_pluck");
const { rtk_ctrl_stuffs } = require("./rtk_ctrl_stuffs");
const rtk_ctrl_tableList = require("./rtk_ctrl_tableList");

module.exports = function rtkCtrlFreeGet(rq,res){
    let sec_ch_ua_mobile = rtk_ctrl_stuffs.sec_ch_ua_mobile
    //let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let url_split = rq.url.split('?');
    let q8get = rq.url.replace(url_split[0],'')
    let u8get = url_split[0].endsWith('/') ?
        url_split[0].substring(1).substring(url_split[0].length - 2, 0).split("/") :
        url_split[0].substring(1).split("/");
    console.log('new rq.url: ', url_split[0]);
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    let u8get_split_length = u8get.length;
    console.log('u8get split: ');
    console.log(u8get);
    let Obj = { u_get: u8get, q_get: q8get }
    switch (u8get_split_length) {
        /* case 1 - select list de table dans une bd. ie path = /couturetestdb -> ['couturetestdb'] */
        case 1:
           rtk_ctrl_tableList(Obj,rq,res)
            break;
        /* case 2 - select tous les elements d'une table dans une bd. 
         ex pour path = /nom_base_de_donnee/nom_table -> ['couturetestdb','nom_table'] */
        case 2:
            rtk_ctrl_getAllRows(Obj,rq,res)
            break;
        //case 3
        case 3:
            if (u8get[2].startsWith('getField___')) {
                rtk_ctrl_getField(Obj,rq,res)
                break;
            }
            else if (["filter", "f", "fi"].includes(u8get[2].split("___")[0])){
                rtk_ctrl_filter(Obj,rq,res);
                break;
            }

            else if (["pluck", "p", "plk", "pluckcount", "pcount", "plkcount"].includes(u8get[2].split("___")[0])) {
                rtk_ctrl_pluck(Obj,rq,res);
                break;
            }

            else {
                // get by id. get is for id, and getField is for any field, i prefer pluck to getField
                //ex :id="45"; http://192.168.1.111:8481/go/users/45
                rtk_ctrl_getById(Obj,rq,res)
                break;
            }
    
        //DEFAULT
        default:
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "error final" }, {}))
            )
    }
}