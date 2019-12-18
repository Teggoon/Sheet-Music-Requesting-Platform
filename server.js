var express = require('express');
var fs = require('fs');


var app = express();


app.get('/',function(req,res)
{
  fs.readFile('home.html', function(err, data) {
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


var server=app.listen(3000,function() {});

console.log("Server listening on port 3000");
