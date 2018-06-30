var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets,
    client2 = require('socket.io').listen(9090).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, baza){
  if(err) throw err;

  var db = baza.db('chat');
  var users = [];
  var numUsers = 0;

  client.on('connection', function(socket){
    socket.on('privatna',function(data){
      var niz = data.data.split('/');
      var user1 = niz[niz.length-1];
      var user2 = niz[niz.length-2];
      var sendStatus = function(s){
        socket.emit('status', s);
      };
      var col = db.collection('privatne');
      var query =  {
           $or: [
             { $and:
               [
                  { "primalac": user1},
                  { "posiljalac": user2}
               ]
             },
             {
                $and:
                [
                  { "posiljalac": user1},
                  { "primalac": user2}
                ]
             }
           ]
      };

      console.log(query);
      col.find(query).limit(100).sort({_id: 1}).toArray(function(err, res){
        if(err) throw err;
        socket.emit('output', res);
      });

      socket.on('input', function(data){
        var posiljalac = data.posiljalac,
            primalac = data.primalac,
            poruka = data.poruka,
            pattern = /^\s*$/;

        if(pattern.test(posiljalac) || pattern.test(primalac) || pattern.test(poruka)){
          console.log("KARDINALNA GRESKA");
        }
        else{
          col.insert({primalac: primalac, posiljalac: posiljalac, poruka: poruka}, function(){
            //Slanje poruke svima
            client2.emit('output', [data]);//<------------Probaj sta bi bilo da je socket.emit
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });
    });

    //----------------GRUPNE-----------------//

    socket.on('grupna', function(){
      socket.username = "nepoznati";
      socket.username += numUsers;
      users.push(socket.username);
      numUsers++;

      var col = db.collection('messages'),
          colUsers = db.collection('users'),
          sendStatus = function(s){
            socket.emit('status', s);
          }
      // Ispis svih poruka
      col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
        if(err) throw err;
        socket.emit('output', res);
      });

      client.emit('onlineUsers', users);

      /*colUsers.find().limit(100).sort({_id: 1}).toArray(function(err, res){
        if(err) throw err;
        socket.emit('onlineUsers', res);
      });*/

      socket.on('sendUserName', function(data){
        var pattern = /^\s*$/,
            name = data.name;

        if(!pattern.test(name)){
          console.log(users.indexOf(name));
          if(users.indexOf(socket.username) || users.indexOf(socket.username) == 0){
            users[users.indexOf(socket.username)] = name;
            socket.username = name;
          }
          else {
            socket.username = name;
            //users.push(name);
          }
          client.emit('onlineUsers', users);
          /*
          colUsers.insert({name: name}, function(){
            client.emit('onlineUsers', [data]);
          });*/
        }
      });
      // Cekam unos poruke
      socket.on('input', function(data){
        var name = data.name,
            message = data.message,
            pattern = /^\s*$/;

        if(pattern.test(name) || pattern.test(message)){
          sendStatus('Ime i poruka su obavezni');
        }
        else{
          col.insert({name: name, message: message}, function(){
            //Slanje poruke svima
            client.emit('output', [data]);//<------------Probaj sta bi bilo da je socket.emit
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });

      socket.on('disconnect', function(){
        if(socket.username){
              users.splice(users.indexOf(socket.username),1);
              client.emit('onlineUsers', users);
          }
        //console.log(username);
        /*var query = { name: username };
        db.collection("users").deleteOne(query, function(err, obj) {
          if (err) throw err;
          baza.close();
        });*/
      });
    })


  });

  client2.on('connection', function(socket){
    socket.on('privatna',function(data){
      var niz = data.data.split('/');
      var user1 = niz[niz.length-1];
      var user2 = niz[niz.length-2];
      var sendStatus = function(s){
        socket.emit('status', s);
      };
      var col = db.collection('privatne');
      var query =  {
           $or: [
             { $and:
               [
                  { "primalac": user1},
                  { "posiljalac": user2}
               ]
             },
             {
                $and:
                [
                  { "posiljalac": user1},
                  { "primalac": user2}
                ]
             }
           ]
      };

      console.log(query);
      col.find(query).limit(100).sort({_id: 1}).toArray(function(err, res){
        if(err) throw err;
        socket.emit('output', res);
      });

      socket.on('input', function(data){
        var posiljalac = data.posiljalac,
            primalac = data.primalac,
            poruka = data.poruka,
            pattern = /^\s*$/;

        if(pattern.test(posiljalac) || pattern.test(primalac) || pattern.test(poruka)){
          console.log("KARDINALNA GRESKA");
        }
        else{
          col.insert({primalac: primalac, posiljalac: posiljalac, poruka: poruka}, function(){
            //Slanje poruke svima
            client2.emit('output', [data]);//<------------Probaj sta bi bilo da je socket.emit
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });
    });

  });
  
});
