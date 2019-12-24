var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
/*const uri = "mongodb+srv://Teggoon:admin@cluster0-zplsz.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });*/
var url = "mongodb://localhost:27017/";


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/',function(req,res)
{
  fs.readFile('login_page.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/composer',function(req,res)
{
  fs.readFile('composer_portal.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

app.get('/client',function(req,res)
{
  fs.readFile('client_portal.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});









  app.post('/submit_form/login',function(req,res)
  {
    var cusername = req.body.username;
    var cpassword = req.body.password;
    console.log("Client requesting login:");
    console.log("Client username: " + cusername);
    console.log("Client password: " + cpassword);
    var queryUsername = {username: cusername};
    var queryEmail = {email: cusername};

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("smdb");


      var collection = dbo.collection("accounts");
      var usernameExists = false;
      var emailExists = false;

      collection.find({username: cusername}).toArray(function(err, result) {
        if (result.length > 0) {
          usernameExists = true;
          console.log("Username exists");
        }
      });

      if (!usernameExists) {
        collection.find({email: cusername}).toArray(function(err, result) {
          if (result.length > 0) {
            usernameExists = true;
            console.log("Email exists");
          }
        });
      }

      var canProceed = false;
      if (emailExists || usernameExists) {
        canProceed = true;
      }

      if (!canProceed) {

      }

      db.close();
    });

  });

  app.post('/submit_form/signup',function(req,res)
  {
    var cusername = req.body.username;
    var cemail = req.body.email;
    var cpassword = req.body.password;
    console.log("Client requesting new account:");
    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("smdb");

      var collection = dbo.collection("accounts");

      db.close();
    });
  });



var server=app.listen(3000,function() {});

console.log("Server listening on port 3000");
