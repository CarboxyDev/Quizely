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


    let url = '/api/quiz/create';

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
            let isKeyValid = data.validKey;

            if (data.success == true){
                console.log('[SERVER] Published a quiz item');
                clearInputs();
            };
            if (isKeyValid){
                keyStatus('success');
            }
            else if (!isKeyValid){
                keyStatus('error');
            };
            alertUser(serverResponse,success=data.success);


        })
        .catch(error => {
            console.log('ERROR : '+error);
            alertUser('Error in sending POST request',success=false);
        });
    

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


function keyStatus(type){
    let keyIcon = document.querySelector('#key-icon');
    if (type == "success"){
        keyIcon.classList = []
        keyIcon.classList.add('fas','fa-check');
        keyIcon.title = 'Key is working';
    }
    if (type == "error"){
        keyIcon.classList = [];
        keyIcon.classList.add('fas','fa-times');
        keyIcon.title = 'Key is not working';
    }
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



// to make it easier for the quiz creator to navigate the inputs
// only need to press ENTER to go to next input instead of using 
// mouse and clicking on it.
function shiftFocus(){
    let currentFocus = document.activeElement;
    let dataShift = currentFocus.getAttribute('data-shift');
    if (dataShift == null){
        let toFocusElem = document.querySelector(`[data-shift="0"]`);
        toFocusElem.focus();
    }
    else {
        dataShift = parseInt(dataShift);
        if (dataShift >= 5){
            dataShift = 0;
        }
        else {
            dataShift += 1;
        }
        let toFocusElem = document.querySelector(`[data-shift='${dataShift}']`);
        toFocusElem.focus();
    }


}



document.addEventListener('keyup',(e) => {
    e.preventDefault();
    // 13 ---> ENTER KEY
    if (e.key === 'Enter'){ 
        shiftFocus();
    };
});













