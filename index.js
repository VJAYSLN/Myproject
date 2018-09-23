var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
console.log('Hi i am Bhuvan 1');
/*
http.createServer(function (req, res) {
  console.log('hi i am bhuvan 2');
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
    console.log('I am bhuvan 3');
  });
}).listen(8080) */

app.post('/logininsert', function(req, res) {
  res.send('You sent the name "' + req.body.first_name + '".');
  console.log("Hi i am Bhuvan");
});

app.listen(8080, function(req,res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
    console.log('I am bhuvan 3');
  });
  console.log('Server running at http://127.0.0.1:8080/');
});