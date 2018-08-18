window.onload = function(){
    const buttons = document.querySelectorAll('button');
    //* show the user's email when put mouser on the button */
    // buttons.forEach(function(button){
    //     button.addEventListener('mouseover',function(){
    //         const pElement = button.nextElementSibling;
    //         pElement.setAttribute('style','visibility:visible');
    //     });
    //     button.addEventListener('mouseout',function(){
    //         const pElement = button.nextElementSibling;
    //         pElement.setAttribute('style','visibility:hidden');
    //     });
    // });
// constK
    const nativeLanguage = document.getElementById('nativeLanguage');
    const learningLan = document.getElementById('learningLan');
    const errorMesse = document.querySelector('.error');
    const form = document.querySelector('form');
    form.onsubmit = function(event){
        event.preventDefault();
        if(nativeLanguage.value==learningLan.value){
            errorMesse.innerHTML = 'Learning language can\'t be the same with native language';
        }else{
            form.submit();
        }

    }
    learningLan.onchange = function(){
        if(learningLan.value==nativeLanguage.value){
            errorMesse.innerHTML = 'Learning language can\'t be the same with native language';
        }else{
            errorMesse.innerHTML = '';

        }
    }
    nativeLanguage.onchange = function(){
        if(learningLan.value==nativeLanguage.value){
            errorMesse.innerHTML = 'Learning language can\'t be the same with native language';
        }else{
            errorMesse.innerHTML = '';

        }
    }
}