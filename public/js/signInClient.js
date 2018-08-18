window.onload=function(){
    const form=document.querySelector('form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm=document.getElementById('passwordConfirm');
    const errorEmail=document.getElementById('errorEmail');
    const errorPassword1=document.getElementById('errorPassword1');
    const errorPassword2=document.getElementById('errorPassword2');
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^[a-zA-Z0-9._-]{5,10}$/;
    
    form.onsubmit = function(event){
        let checkResult=true;
        event.preventDefault();
        if(!email.value){
            console.log(email.value);
            errorEmail.innerHTML='Please input a email.'
            checkResult = false;
        }else if(!emailRegex.test(email.value)){
            errorEmail.innerHTML='Please input a valid email.'
            checkResult = false;
        }else if(!password.value){
            errorPassword1.innerHTML='Please input password'
            checkResult = false;
        }
        console.log('check result:',checkResult);
        if(checkResult){
            form.submit();
        }
    }
    email.oninput=function(){
        errorEmail.innerHTML = ' ';
    };

    email.onblur=function(){
        if(!emailRegex.test(email.value)){
            console.log('element error:',errorEmail);
            errorEmail.innerHTML='Please enter a valid email address';
        }
    }
    password.onblur=function(){
        if(!passwordRegex.test(password.value)){
            errorPassword1.innerHTML='Only numbers and letters are allowed, and the length between 5 and 10'
        }
    }
    password.oninput=function(){
        errorPassword1.innerHTML = ' ';
    };
    passwordConfirm.onblur=function(){
        if(passwordConfirm.value!==password.value){
            errorPassword2.innerHTML="The password is not the same with first one"
        }
    }
    passwordConfirm.oninput=function(){
        errorPassword2.innerHTML = ' ';
    };
    
}