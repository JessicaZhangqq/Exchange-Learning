window.onload=function(){
    const errorEmail=document.getElementById('errorEmail');
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    const errorPassword = document.getElementById('errorPassword');
    const form = document.querySelector('form');
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    form.onsubmit = function(event){
        event.preventDefault();
        console.log('form.onsubmit');
        if(!email.value){
            errorEmail.innerHTML='Please input email!';
        }else if(!password.value){
            errorPassword.innerHTML='Please input password';
        }else{
            form.submit();
        }
    }
    email.oninput=function(){
        errorEmail.innerHTML=' ';
    }
    email.onblur=function(){
        if(!emailRegex.test(email.value))
        errorEmail.innerHTML='Please input a valid email address ';
    }
}