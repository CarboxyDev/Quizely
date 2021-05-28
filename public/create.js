let submitBtn = document.querySelector('#submit');

let input = {
    question:document.querySelector('#question'),
    answer:document.querySelector('#answer'),
    option1:document.querySelector('#option1'),
    option2:document.querySelector('#option2'),
    option3:document.querySelector('#option3'),
    difficulty:document.querySelector('#difficulty'),
    key:document.querySelector('#key'),
}


submitBtn.addEventListener('click',() => {

    let sendData = {
        question:input.question.value,
        answer:input.answer.value,
        option1:input.option1.value,
        option2:input.option2.value,
        option3:input.option3.value,
        difficulty:adjustDifficultyInput(input.difficulty.value),
        key:input.key.value
    }


    let url = '/create-quiz';

    let options = {
        method:'POST',
        body: JSON.stringify(sendData),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    };



    fetch(url,options)
        .then(res => res.json())
        .then(data => {
            let serverResponse = data.message;
            if (data.success){
                console.log('[SERVER] Published a quiz item');
                clearInputs();
            }
            alertUser(serverResponse,success=data.success);

        })
        .catch(error => {
            console.log('ERROR : '+error);
            alertUser('[CLIENT] Error in sending POST request',success=false);
        })
    

});


function clearInputs(){

    input.question.value = '';
    input.answer.value = '';
    input.option1.value = '';
    input.option2.value = '';
    input.option3.value = '';
    input.difficulty.value = '';

}

function adjustDifficultyInput(diff){
    diff = diff.charAt(0).toUpperCase() + diff.substring(1,diff.length);
    if (diff == 'Medium'){
        diff = 'Moderate';
    }
    if (diff == 'Tough'){
        diff = 'Hard'
  s  }
    if (diff == 'E'){
        diff = 'Easy';
    }
    if (diff == 'M'){
        diff = 'Moderate';
    }
    if (diff == "H"){
        diff = 'Hard';
    }

    return diff;

}





let alertPopup = Swal.mixin({
    toast:true,
    position:'top-right',
    showConfirmButton:false,
    timer:3500,
    timerProgressBar:false
    
}); 


function alertUser(title,success=false){
    let icon = 'error';
    let alertClass = 'alert-error';
    if (success == true){
        icon='success';
        alertClass = 'alert-success';
    }

    alertPopup.fire({
        title:title,
        icon:icon,
        customClass : {
            'popup':alertClass
        }
    });
    document.querySelector('.swal2-title').style.color = '#fff';
}



function difficultyInfo(){

    let html = `<br>
    Difficulty can be of 3 types :<br>Easy, Medium and Hard.<br><br>
    The difficulty input is case-insensitive.

    
    <br>`;

    Swal.fire({
        title:'Difficulty',
        html:html,
        confirmButtonText:"Alright",
        icon:'info',
        showConfirmButton:false,
        showCloseButton:true,
        toast:true
    })

}


