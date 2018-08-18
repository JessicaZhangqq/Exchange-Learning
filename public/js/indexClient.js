window.onload = function(){
    console.log('hi');
    const buttons = document.querySelectorAll('.containerButton');
    buttons.forEach(function(button){
        button.addEventListener('mouseover',function(){
            const pElement = button.nextElementSibling;
            pElement.setAttribute('style','visibility:visible');
        });
        button.addEventListener('mouseout',function(){
            const pElement = button.nextElementSibling;
            pElement.setAttribute('style','visibility:hidden');
        });
    });

}