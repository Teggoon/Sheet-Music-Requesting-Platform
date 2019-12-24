var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongo = require('mongodb');


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
  console.log("Client requesting login:");
  console.log(req.body.username);
  console.log(req.body.password);
});

app.post('/submit_form/signup',function(req,res)
{
  console.log("Client requesting new account:");
  console.log(req.body.username);
  console.log(req.body.password);
});

var server=app.listen(3000,function() {});

console.log("Server listening on port 3000");
