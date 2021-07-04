
const r = require('rethinkdb');
module.exports.selectAll = (_,r,dbName, tableName, doc_Key_ID) =>{
   r.db(dbName)
.table(tableName)  
  .run(_, function (err, result) {
    if (err) return console.log(Object.assign({}, err));
    res.end(JSON.stringify(result, null, 2));
  })
};

module.exports.selectById = (_,r,dbName, tableName, doc_ID_Value) => {
  r.db(dbName)
.table(tableName)
  .get(doc_ID_Value)
  .run(_, function (err, result) {
    if (err) return console.log(Object.assign({}, err));
    res.end(JSON.stringify(result, null, 2));
  })
};
module.exports.selectByField = (_, r, dbName, tableName, doc_Field_Name) => {
  r.db(dbName)
    .table(tableName)
    .get(doc_Field_Name)
    .run(_, function (err, result) {
      if (err) return console.log(Object.assign({}, err));
      res.end(JSON.stringify(result, null, 2));
    })
};
module.exports.insert = (_, r,dbName, tableName, data2insert) => {
  r.db(dbName)
    .table(tableName)
    .insert(data2insert)
    .run(_, function (err, result) {
      if (err) return console.log(Object.assign({}, err));
      res.end(JSON.stringify(result, null, 2));
    });
};
module.exports.createDB = (_,r,dbName) => { 
r.dbCreate(dbName)
.run(_, function (err, result) {
  if (err) return console.log(Object.assign({}, err));
  res.end(JSON.stringify(result, null, 2));
});
};

module.exports.createTable = (_,r,tableName) => {
  r.dbCreate(tableName)
  .run(_, function (err, result) {
    if (err) return console.log(Object.assign({}, err));
    res.end(JSON.stringify(result, null, 2));
  });
};

