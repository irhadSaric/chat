(function(){
  var getNode = function(s){
    return document.querySelector(s);
  },

  textarea = getNode('.chat textarea'),
  messages = getNode('.chat-messages'),
  status = getNode('.chat-status span'),
  users = getNode('.users'),
  statusDefault = status.textContent,
  url = window.location.href,
  niz = url.split('/'),
  posiljalac = niz[niz.length-1],
  primalac = niz[niz.length-2],
  setStatus = function(s){
    status.textContent = s;

    if(s !== statusDefault){
      var delay = setTimeout(function(){
        setStatus(statusDefault);
        clearInterval(delay);
      }, 2000)
    }
  };

  //textarea.textContent="sukurac";


  try {
    var socket = io.connect('http://127.0.0.1:9090');
  } catch (e) {

  }

  if(socket !== undefined){
    socket.emit('privatna', {data: url});
    socket.on('output', function(data){
      if(data.length){
        //Ispisujem niz poruka iz baze

        for(var i = 0; i < data.length; i++){
          if(data[i].primalac == primalac || data[i].primalac == posiljalac){
            var message = document.createElement('div');
            message.setAttribute('class', 'chat-message');
            message.textContent = data[i].posiljalac + ': ' + data[i].poruka;

            messages.appendChild(message);
            messages.insertBefore(message, messages.firstChild);
          }
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
          url = window.location.href,
          niz = url.split('/');

      if(event.which === 13 && event.shiftKey === false){
        socket.emit('input', {primalac: niz[niz.length-2], posiljalac:niz[niz.length-1], poruka:self.value});
      }
    });
  }
})();
