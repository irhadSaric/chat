var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var alert = require('alert-node');
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
  var data = {poruka: ""};
  res.render('login', {data});
});

app.get('/chat/:username', function(req, res){
  res.render('index', {username: req.params.username});
});

app.get('/login', function(req, res){
  if(req.query.poruka){
    var data = {poruka: req.query.poruka};
  }
  else{
    var data = {poruka : ""};
  }
  res.render('login', {data});
});

app.get('/register', function(req, res){
  if(!req.query.username){
    var data = {poruka: "", username: "", email:""};
    res.render('register', {data});
  }
  else{
    var data = {poruka: req.query.greska, username: req.query.username, email:req.query.email};
    res.render('register', {data});
  }

});

app.get('/register/:greska', function(req, res){
  res.redirect("/register?username="+req.query.username+"&email="+req.query.email+"&greska=Dati korisnik postoji");
  //res.render("/register", req.data);12345
});

app.post('/login', urlencodedParser, function (req, res) {
  mongo.connect("mongodb://127.0.0.1/chat", function(err, database){
    if(err) throw err;
    var db = database.db('chat');
    var col = db.collection('users');

    var username = req.body.username;
    var password = req.body.password;

    var rez = col.find({username: username}, {_id: 1}).toArray(function(err, res2){
        if(res2[0] === undefined){
          res.redirect("/login?poruka=Ne postoji dati korisnik");
        }
        else{
          var dbPassword = res2[0].password;
          if(password == dbPassword){
            res.redirect("/chat/"+username);
          }
          else {
            res.redirect("/login?poruka=Netačan password");
          }
        }
    });


  });

});

app.post('/register', urlencodedParser, function(req, res){
  mongo.connect("mongodb://127.0.0.1/chat", function(err, database){
      if(err) throw err;
      var db = database.db('chat');

      var username = req.body.usernameReg,
          password = req.body.password,
          email = req.body.email;

      console.log(email+" "+username+" "+password);
      var col = db.collection('users');
      var rez = col.find({username: username}, {_id: 1}).toArray(function(err, res2){
        if(err) console.log(err);

        var data = {poruka: "Username u upotrebi"};
        var data2 = {poruka: "Uspješno ste se registrovali"};
        if(res2[0] === undefined){
          col.insert({username: username, password: password, email: email}, function(err, res3){
            if(err) res.render("/login", {data});
            res.redirect('/chat/'+username);
          });
        }
        else{
          res.redirect("/register/greska?username="+username+"&email="+email);
        }
      });
  })


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
