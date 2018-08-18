window.onload=function(){
    const form=document.querySelector('form');
    // form.onsubmit=function(event){
    //     event.preventDefault();
        
    // }
    const image=document.getElementById('profilePhoto');
    const uploadFile=document.getElementById('file');
    uploadFile.onchange= function(event) {
        // const output = document.getElementById('output');
        image.src = URL.createObjectURL(event.target.files[0]);
      };
    //check native language can't be same with learning language
    const nativeLanguage = document.getElementById('nativeLanguage');
    const learningLan = document.getElementById('learningLan');
    const nameInput = document.getElementById('name');
    const errorLearning =document.getElementById('errorLearning');
    const errorNativeLanguage =document.getElementById('errorNativeLanguage');
    const errorName =document.getElementById('errorName');
    form.onsubmit = function(event){
        event.preventDefault();
        let checkResult=true;
        if(nameInput.value.length==0){
            errorLearning.innerHTML = 'Please select the language you are learning!';
            checkResult = false;
        }
        if(!nativeLanguage.value){
            errorNativeLanguage.innerHTML = 'Please select your native language!';
            checkResult = false;
        }
        if(!learningLan.value){
            errorName.innerHTML = 'Please input your name!';
            checkResult = false;
        }
        if(nameInput.value.length==0){
            errorLearning.innerHTML = 'Please select the language you are learning!';
            checkResult = false;
        }
        if(nativeLanguage.value==learningLan.value){
            errorLearning.innerHTML = 'The learning language you selected is the same with your native language, please check! ';
            checkResult = false;
        }
        if(checkResult){
            form.submit();
        }
        console.log('value of name',nameInput.value);
    }  
    learningLan.onblur = function(){
        if(nativeLanguage.value==learningLan.value){
            errorLearning.innerHTML = 'The learning language you selected is the same with your native language, please check! ';
        }
    }
    learningLan.onchange = function(){
        errorLearning.innerHTML = ' ';
    }
    nativeLanguage.onchange = function(){
        errorLearning.innerHTML = ' ';
        errorNativeLanguage.innerHTML = ' ';
    }
    nameInput.oninput = function(){
        errorName.innerHTML = ' ';
    }
}