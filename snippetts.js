
r.db('test').tableCreate('authors').run(connection, function (err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})


r.table('authors').insert([
    {
        name: "William Adama", tv_show: "Battlestar Galactica",
        posts: [
            { title: "Decommissioning speech", content: "The Cylon War is long over..." },
            { title: "We are at war", content: "Moments ago, this ship received word..." },
            { title: "The new Earth", content: "The discoveries of the past few days..." }
        ]
    },
    {
        name: "Laura Roslin", tv_show: "Battlestar Galactica",
        posts: [
            { title: "The oath of office", content: "I, Laura Roslin, ..." },
            { title: "They look like us", content: "The Cylons have the ability..." }
        ]
    },
    {
        name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
        posts: [
            { title: "Civil rights", content: "There are some words I've known since..." }
        ]
    }
]).run(connection, function (err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result, null, 2));
})
r.table("authors").get("207467e4-c0ef-4e5a-be9c-b95b82cecba2");



r = require("rethinkdb");
xhttp = require("http");
let xport = 8383;

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
    connectRethinkdb()
      .then((_) => {
        r.db("test");
        r.table("folas")
          .get("1aac61d4-9538-49c5-88b6-d115b9659111")
          .run(_, function (err, result) {
            if (err) return console.log(Object.assign({}, err));
            res.end(JSON.stringify(result, null, 2));
          });
      })
      .catch((e) => console.log(Object.assign({}, e)));
  })
  .listen(xport); 

