var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";




function createAccCollection(dbo) {
  createAccountCollectionP.then();
};



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo;
  var accountCollection;

  var createDatabaseP = new Promise(function(resolve, reject){
    dbo = db.db("smdb");
    console.log("database created!");


    accountCollection = dbo.collection("accounts");

    accountCollection.insertOne({username: "_", email: "_", password: "_", });
    console.log("Inserted filler account.");

    resolve(); //connect to r38
  });



  createDatabaseP.then(function(){
    //r38
      db.close();
  }, function(err){console.log(err);})

  /*accountCollection.find({username: "."}).toArray(function(err, result) {
    console.log(result);
  });*/

});
