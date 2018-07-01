(function(){
  var getNode = function(s){
    return document.querySelector(s);
  },

  textarea = getNode('.chat textarea'),
  chatName = getNode('.chat-name'),
  messages = getNode('.chat-messages'),
  status = getNode('.chat-status span'),
  users = getNode('.users'),
  statusDefault = status.textContent,
  setStatus = function(s){
    status.textContent = s;

    if(s !== statusDefault){
      var delay = setTimeout(function(){
        setStatus(statusDefault);
        clearInterval(delay);
      }, 2000)
    }
  }

  //textarea.textContent="sukurac";


  try {
    var socket = io.connect('http://127.0.0.1:8080');
  } catch (e) {

  }

  if(socket !== undefined){
    socket.emit('grupna');
    socket.username = chatName.textContent;
    socket.emit('sendUserName', {name: socket.username});

    socket.on('onlineUsers', function(data){
      while (users.firstChild) {
          users.removeChild(users.firstChild);
      }
      if(data.length){
        for(var i = 0; i < data.length; i++){
          var a = document.createElement('a');
          var linkText = document.createTextNode(data[i]);
          a.appendChild(linkText);
          a.href = "/privatne/"+data[i]+"/"+socket.username;
          users.appendChild(a);
/*
          var user = document.createElement('li');
          user.textContent = data[i].name;

          users.appendChild(user);*/
        }
      }
    });

    socket.on('output', function(data){
      if(data.length){
        //Ispisujem niz poruka iz baze

        for(var i = 0; i < data.length; i++){
          var message = document.createElement('div');
          message.setAttribute('class', 'chat-message');
          message.textContent = data[i].name + ': ' + data[i].message;

          messages.appendChild(message);
          messages.insertBefore(message, messages.firstChild);
        }
      }
    });

    // Osluskujem promjenu Statusa

    socket.on('status', function(data){
      setStatus((typeof data === 'object') ? data.message : data);

      if(data.clear === true){
        textarea.value = '';
      }
    });

    // Osluskujem unos teksta

    textarea.addEventListener('keydown', function(event){
      var self = this,
          name = chatName.value;

      if(event.which === 13 && event.shiftKey === false){
        socket.emit('input', {name: name, message:self.value});
      }
    });
  }
})();
