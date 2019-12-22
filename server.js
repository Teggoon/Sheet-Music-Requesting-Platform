var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');


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

app.post('/submit_form',function(req,res)
{
  console.log("Client sent info:");
  console.log(req.body.username);
  console.log(req.body.password);
});
var server=app.listen(3000,function() {});

console.log("Server listening on port 3000");