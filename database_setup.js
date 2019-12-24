var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("smdb");

  dbo.createCollection("accounts", function(err, res) {
    if (err) throw err;
  });

  var accountCollection = dbo.collection("accounts");

  accountCollection.insertOne({username: "_", email: "_", password: "_", });

  accountCollection.find({}).toArray(function(err, result) {
    console.log(result);
  });

  db.close();
});
