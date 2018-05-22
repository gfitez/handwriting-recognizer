var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var path = require('path');



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/html.html'));
});


app.get('/getData', function(req, res){
  res.type('pdf')
  res.sendFile(path.join(__dirname + '/data'+req.query.d),"binary")
});

app.get('/letters.js', function(req, res){
  res.sendFile(path.join(__dirname + '/letters.js'))
});

app.get('/recognize.js', function(req, res){
  res.sendFile(path.join(__dirname + '/recognize.js'))
});

app.get('/data.js', function(req, res){
  res.sendFile(path.join(__dirname + '/data.js'))
});

app.get('/basicDemo.html', function(req, res){
  res.sendFile(path.join(__dirname + '/basicDemo.html'))
});

app.get('/training.html', function(req, res){
  res.sendFile(path.join(__dirname + '/training.html'))
});
app.get('/test.html', function(req, res){
  res.sendFile(path.join(__dirname + '/test.html'))
});


app.listen(8000, '0.0.0.0', function() {//connect on other computers using network name/ip
    console.log('Listening to port:  ' + 8080);
});
