#!/usr/bin/env nodejs

const fs = require("fs");
const rtkCtrlFreeGet = require("./controllers/rtk_ctrl_free_get/rtkCtrlFreeGet");
/*
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};
let xhttp = require("https");

*/

let xhttp = require('http');
let dbf = require("./db_functions");
let prodO = require("./prodO");
const { createConnection } = require("net");

let xport = 8181;
xhttp
  .createServer((rq, res) => {   
    rtkCtrlFreeGet(rq,res)
  }).listen(xport, "");

console.log(process.env.USERDOMAIN, process.env.USERNAME);  
console.log('process.env.USERDOMAIN:',process.env.USERDOMAIN ??process.env.WSL_DISTRO_NAME);
console.log('process.env.USERNAME:',process.env.USERNAME?? process.env.USER);
console.log('Port:',xport);
console.log((new Date).toLocaleString());
 