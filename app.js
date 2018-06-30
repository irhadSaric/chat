var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var server = http.createServer(app);
server.on('error', function (e) {
  // do your thing
});
server.listen(3000);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
  //res.render('index');
  res.render('login');
});

app.get('/chat/:username', function(req, res){
  res.render('index', {username: req.params.username});
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', urlencodedParser, function (req, res) {
  res.redirect('/chat/'+req.body.username);
});

app.get('/contact/:name', function(req, res){
  var data = {name: req.params.name}
  res.render('contact', {data});
});

app.get('/privatne/:user1/:user2', function(req, res){
  data = {user1: req.params.user1, user2: req.params.user2};
  res.render('privatne', {data});
});

//app.listen(3000);
