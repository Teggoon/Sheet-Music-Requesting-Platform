var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
/*const uri = "mongodb+srv://Teggoon:admin@cluster0-zplsz.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });*/
var url = "mongodb://localhost:27017/";



var loggedInUserMap = new Map();
var hash = crypto.createHash("sha256");


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))


//takes in 3 promises, a request body, and a response object
function checkUsernameExistence(usernamePromise, emailPromise, passwordPromise, reqbody, res) {
  usernamePromise.then(function(result) {
      console.log("Returned from username check, the promise's result is: " + result);
      if (!result) {
        checkEmailExistence(emailPromise, passwordPromise, reqbody, res);
      } else {
        canProceed = result;
        processUsernameValidity(passwordPromise, canProceed, reqbody, res);
      }
  }, function(err) {
      console.log("Something went wrong at username check");
  }
  );
}

//takes in 2 promises, a request body, and a response object
function checkEmailExistence(emailPromise, passwordPromise, reqbody, res) {
  emailPromise.then(function(result) {
      console.log("Returned from email check, the promise's result is: " + result);
      canProceed = result;
      processUsernameValidity(passwordPromise, canProceed, reqbody, res);
  }, function(err) {
      console.log("Something went wrong at email check");
  }
  );
}


function processUsernameValidity(passwordPromise, canProceed, reqbody, res) {
  console.log("I am called.");
  if (!canProceed) {
    console.log("Client's username not found; access denied.");
    res.statusCode = 200;
    res.write("Username not found!");
    res.send();
  } else {
    console.log("Client's username found! Proceeding to checking password.");
    checkPassword(passwordPromise, reqbody, res);
  }
}


function checkPassword(passwordPromise, reqbody, res) {
  passwordPromise.then(function(result) {
    if (result) {
      console.log("Password Is Correct!!");
      //console.log("Hash for user " + reqbody.username + " with password " + reqbody.password + ": " + hashId);
      affirmLogin(reqbody, res);
    } else {
      console.log("Password Is incorrect.");
      denyLogin(reqbody, res);
      res.send();
    }
  }, function(err) {
      console.log("Something went wrong at password check");
  }
  );
}

function checkClientLogin(usernamePromise, emailPromise, passwordPromise, reqbody, res) {
  checkUsernameExistence(usernamePromise, emailPromise, passwordPromise, reqbody, res);
}


function affirmLogin(reqbody, res) {
  var hashId = hash.update(reqbody.username + reqbody.password);
  //the response object that is sent to the client.
  var resObj = {
    status_code: 200,
    id: hashId,
    name: reqbody.username,
  };
  res.write(JSON.stringify(resObj));
  res.send();
}

function denyLogin(reqbody, res) {
  var hashId = hash.update(reqbody.username + reqbody.password);
  //the response object that is sent to the client.
  var resObj = {
    status_code: 401,
    message: "Password incorrect! Please try again."
  };
  res.write(JSON.stringify(resObj));
  res.send();
}


app.get('/',function(req,res)
{
  fs.readFile('client/master_client_page.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});

function respondHTMLFile(str) {
  app.get('/' + str,function(req,res)
  {
    console.log("Client requesting " + str);
    fs.readFile("client/" + str, function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  });
}
respondHTMLFile("login_page_template.htm");
respondHTMLFile("client_portal.htm");

/*
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
});*/


// Handling login requests.
// req is the request object
// res is the response object
app.post('/submit_form/login',function(req,res)
{
  var cusername = req.body.username;
  var cpassword = req.body.password;
  console.log("Client requesting login:");
  console.log("Client username: " + cusername);
  console.log("Client password: " + cpassword);

  //two objects used to query in MongoDB
  var queryUsername = {username: cusername};
  var queryEmail = {email: cusername};

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("smdb");

    // basic database checking
    var collection = dbo.collection("accounts");
    var usernameExists = false;
    var emailExists = false;
    var passwordCorrect = false;
    var canProceed = false;

    // Sanity check to see the accounts in the database
    console.log("Current accounts in the database:");
    collection.find({}).toArray(function(err, result) {
      console.log(result);
    });

    var promise_checkUsernameExistence = new Promise(function(resolve, reject) {
      collection.find({username: cusername}).toArray(function(err, result) {
        usernameExists = result.length > 0;
        resolve(usernameExists);
      });
    });


    var promise_checkEmailExistence = new Promise(function(resolve, reject) {
      collection.find({email: cusername}).toArray(function(err, result) {
        usernameExists = result.length > 0;
        resolve(usernameExists);
      });
    });

    var promise_checkPassword = new Promise(function(resolve, reject) {
      collection.find({password: cpassword}).toArray(function(err, result) {
        passwordCorrect = result.length > 0;
        resolve(passwordCorrect);
      });
    });





checkClientLogin(promise_checkUsernameExistence, promise_checkEmailExistence, promise_checkPassword, req.body, res);





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
    var usernameCollision = false;
    var emailCollision = false;

    collection.find({username: cusername}).toArray(function(err, result) {
      if (result.length > 0) {
        usernameCollision = true;
        console.log("Client's requested username is already taken!");
      }
    });

    collection.find({username: cemail}).toArray(function(err, result) {
      if (result.length > 0) {
        emailCollision = true;
        console.log("Client's requested email has already registered!");
      }
    });

    if (usernameCollision) {

    } else if (emailCollision) {

    } else {
      console.log("No collision detected! Proceeding to create account");

      collection.insertOne({username: cusername, email: cemail, password: cpassword});
      console.log("New account created!");
      affirmLogin(req, res);
    }


    db.close();
  });
});



var server=app.listen(3000,function() {});

console.log("Server listening on port 3000");
