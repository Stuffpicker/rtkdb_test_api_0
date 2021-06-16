#!/usr/bin/env nodejs
let r = require("rethinkdb");
const fs = require("fs");
/*
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};
let xhttp = require("https");

*/
function sec_ch_ua_mobile(rh){let t = rh; return t[t.indexOf('sec-ch-ua-mobile')+1]}
let xhttp = require('http');
let dbf = require("./db_functions");
let prodO = require("./prodO");
const { createConnection } = require("net");
let xport = 8181;

function connectRethinkdb(rethinkhost = ["192.168.1.110", "192.168.1.106"]) {
  let connection = null;
  return Promise.resolve(
    r.connect({ host: rethinkhost[0], port: 28015 }, function (err, conn) {
      if (err) connection = err;
      if (conn) connection = conn;
      return connection;
    })
  );
}
xhttp
  .createServer((rq, res) => {  
    let S_Get = rq.url.endsWith('/')?rq.url.substring(1).substring(rq.url.length-2,0).split("/")
    :rq.url.substring(1).split("/");
        console.log('rq.url: ');
          rq.url!='/favicon.ico'?console.log('sec_ch_ua_mobile: ',sec_ch_ua_mobile(rq.rawHeaders)):'';
        console.log('S_Get: ');
          console.log(S_Get);
        
          let S_Get_split = S_Get
    console.log('S_Get_split:',S_Get_split)
    let S_Get_split_length =S_Get_split.length;
    switch (S_Get_split_length){
      /* case 1 - select list de table dans une bd. ie path = /couturetestdb -> ['couturetestdb'] */
      case 1:
          connectRethinkdb()
            .then((_) => {
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
                    [ Object.assign(
                        { valid: "yes", what: "Table List" },
                        { result }),
                    ],null, 2
                  ) 
                );
              })
            }) 
            .catch((e) =>
                res.end(
                  JSON.stringify(Object.assign({ valid: "no", what: "error case 1-1 final" }, e))
                )
            );  
      break;
      /* case 2 - select tous les elements d'une table dans une bd. 
       ex pour path = /nom_base_de_donnee/nom_table -> ['couturetestdb','nom_table'] */
      case 2:
        
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
                      if (err){
                        res.end(
                          JSON.stringify(
                            Object.assign({ valid: "no", what: "error case 2-1 " }, err)
                          )
                        );return;
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
    break;
    //case 3
    case 3:
      if(S_Get[2].startsWith('getField__')){
        // ie: http://localhost:8181/go/users/getField__email
        S_Get[2]=S_Get[2].replace('getField__','')     
        connectRethinkdb()
          .then((_) => {
                  r.db(S_Get[0])
            .table(S_Get[1])
          .getField(S_Get[2])
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
                      if (err){
                        res.end(
                          JSON.stringify(
                            Object.assign({ valid: "no", what: "error case 3-1 " }, err)
                          )
                        );return;
                      }
                      res.end(JSON.stringify(result, null, 2));
                      return;
                    });
                  }
                })})
          .catch((e) =>
            res.end(
            JSON.stringify(Object.assign({ valid: "no", what: "error final case 3-catch" }, e))
          )
        ) }
        else if (["filter", "f", "fi"].includes(S_Get[2].split("___")[0])) {
          // ie:http://localhost:8181/go/users/f___nom___dola
            connectRethinkdb()
          .then((_) => { 
            r.db(S_Get[0])
              .table(S_Get[1])
              .filter(
                r.row(S_Get[2].split("___")[1]).eq(S_Get[2].split("___")[2])
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
          .catch((e) =>
            res.end(
            JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
          )
        )
        break;

        }
        
        else{
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
          })})
          .catch((e) =>
            res.end(
            JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
          )
        )

        }
        break;
    // case 4 
        case 4:
           connectRethinkdb()
            .then((_) => {
                r.db(S_Get[0])
          .table(S_Get[1])
          .run(_, function (err, cursor) {
            if (err) {
              return res.end(
                  JSON.stringify(
                    Object.assign({ valid: "no", what: "error 1-0" }, err)
                  )
                );
              }
             if (cursor) {
                  cursor.toArray(function (err, result) {
                    if (err){
                      res.end(
                        JSON.stringify(
                          Object.assign({ valid: "no", what: "error 1-2" }, err)
                        )
                      );return;
                    }
                    res.end(JSON.stringify(result, null, 2));
                    return;
                  });
                }
            })
            })   .catch((e) =>
        res.end(
          JSON.stringify(Object.assign({ valid: "no", what: "error final" }, e))
        )
      ); 
      break;
      //DEFAULT
    default:
         res.end(
          JSON.stringify(Object.assign({ valid: "no", what: "error final" }, {}))
        ) 
     }

  }).listen(xport, "");         
   
 
console.log(process.env.USERDOMAIN, process.env.USERNAME);  
console.log('process.env.USERDOMAIN:',process.env.USERDOMAIN ??process.env.WSL_DISTRO_NAME);
console.log('process.env.USERNAME:',process.env.USERNAME?? process.env.USER);
console.log('Port:',xport);
//console.log(process.env);
