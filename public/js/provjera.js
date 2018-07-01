var poruka = document.getElementById("poruka");
var username = document.getElementsByName('usernameReg')[0];
var password = document.getElementsByName('password')[0];
var password2 = document.getElementsByName('password2')[0];
var email = document.getElementsByName('email')[0];
var submit = document.getElementById("submit");

var userCheck = false,
    passCheck = false,
    pass2Check = false,
    emailCheck = false;

submit.disabled = true;

username.addEventListener("keyup", function(){
  if(this.value.length < 4){
    userCheck = false;
    poruka.innerHTML = "Username mora imati bar 4 znaka";
  }
  else{
    dugme();
    userCheck = true;
    poruka.innerHTML = "";
  }
});

password.addEventListener("keyup", function(){
  if(this.value.length < 5){
    poruka.innerHTML = "Password mora imati bar 5 karaktera";
  }
  else {
    poruka.innerHTML = "";
    passCheck = true;
    dugme();
  }
});

password2.addEventListener("keyup", function(){
  if(password.value != password2.value){
    poruka.innerHTML = "Ne poklapaju se passwordi";
  }
  else {
    pass2Check = true;
    dugme();
    poruka.innerHTML = "";
  }
});

email.addEventListener("keyup", function(){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email.value).toLowerCase())){
      emailCheck = true;
      poruka.innerHTML = ""
      dugme();
    }
    else {
      poruka.innerHTML = "Pogrešan e-mail";
    }
});

function dugme(){
  if(userCheck && passCheck && pass2Check && emailCheck){
    submit.disabled = false;
  }
}
