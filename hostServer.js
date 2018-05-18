var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var path = require('path');
require("jquery")


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/html.html'));
});


app.get('/getData', function(req, res){
  res.type('pdf');
  res.sendFile(path.join(__dirname + '/data'+req.query.d),"binary")
});

app.get('/letters.js', function(req, res){
  res.type('pdf');
  res.sendFile(path.join(__dirname + '/letters.js'),"binary")
});

app.listen(3000, '0.0.0.0', function() {//connect on other computers using network name/ip
    console.log('Listening to port:  ' + 3000);
});
