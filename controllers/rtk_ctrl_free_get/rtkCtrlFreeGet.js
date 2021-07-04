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
    let connectRethinkdb = rtk_ctrl_stuffs.connectRethinkdb
    let S_Get = rq.url.endsWith('/') ?
        rq.url.substring(1).substring(rq.url.length - 2, 0).split("/") :
        rq.url.substring(1).split("/");
    console.log('rq.url: ');
    rq.url != '/favicon.ico' ? console.log('sec_ch_ua_mobile: ', sec_ch_ua_mobile(rq.rawHeaders)) : '';
    let S_Get_split_length = S_Get.length;
    console.log('S_Get split: ');
    console.log(S_Get);
    switch (S_Get_split_length) {
        /* case 1 - select list de table dans une bd. ie path = /couturetestdb -> ['couturetestdb'] */
        case 1:
           rtk_ctrl_tableList(null,rq,res)
            break;
        /* case 2 - select tous les elements d'une table dans une bd. 
         ex pour path = /nom_base_de_donnee/nom_table -> ['couturetestdb','nom_table'] */
        case 2:
            rtk_ctrl_getAllRows(null,rq,res)
            break;
        //case 3
        case 3:
            if (S_Get[2].startsWith('getField__')) {
                rtk_ctrl_getField(null,rq,res)
                break;
            }
            else if (["filter", "f", "fi"].includes(S_Get[2].split("___")[0])){
                rtk_ctrl_filter(rq,res);            
                break;
            }

            else if (["pluck", "p", "plk"].includes(S_Get[2].split("___")[0])) {
               rtk_ctrl_pluck(rq,res);
                break;
            }

            else {
                // get by id. get is for id, and getField is for any field, i prefer pluck to getField
                //ex :id="45"; http://192.168.1.111:8481/go/users/45
                rtk_ctrl_getById(null,rq,res)
                break;
            }
    
        //DEFAULT
        default:
            res.end(
                JSON.stringify(Object.assign({ valid: "no", what: "error final" }, {}))
            )
    }
}