var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("smdb");

  dbo.createCollection("accounts", function(err, res) {
    if (err) throw err;
  });

  var accountCollection = dbo.collection("accounts");

  var cleared = false;

  accountCollection.deleteMany({},function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted, reset to empty collection.");
    cleared = true;
  });

  if (cleared) {
    accountCollection.insertOne({username: "_", email: "_", password: "_", });
    console.log("Inserted filler account.");
  }

  /*accountCollection.find({username: "."}).toArray(function(err, result) {
    console.log(result);
  });*/

  db.close();
});
