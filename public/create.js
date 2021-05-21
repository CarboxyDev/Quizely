let submitBtn = document.querySelector('#submit');
let questionInput = document.querySelector('#question');
let answerInput = document.querySelector('#answer');
let opt1Input = document.querySelector('#option1');
let opt2Input = document.querySelector('#option2');
let opt3Input = document.querySelector('#option3');
let difficultySelect = document.querySelector('#difficulty');
let keyInput = document.querySelector('#key');

let status = document.querySelector('#status');

submitBtn.addEventListener('click',() => {
    

    let sendData = {
        question:questionInput.value,
        answer:answerInput.value,
        option1:opt1Input.value,
        option2:opt2Input.value,
        option3:opt3Input.value,
        difficulty:difficultySelect.value,
        key:keyInput.value
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
            console.log('POST : '+url)
            let serverResponse = data.message;
            if (data.success == true){
                console.log('[create-quiz] Published a quiz item');
                clearInputs();
            }
            alertUser(serverResponse,success=data.success);

        })
        .catch(error => {
            console.log('ERROR : '+error);
            alertUser('Error in sending fetch request',success=false);
        })
    

});


function clearInputs(){

    questionInput.value = '';
    answerInput.value = '';
    opt1Input.value = '';
    opt2Input.value = '';
    opt3Input.value = '';
    difficulty.value = '';

}

let alertPopup = Swal.mixin({
    toast:true,
    position:'top-right',
    showConfirmButton:false,
    timer:4000,
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
    document.querySelector('.swal2-title').style.color = "#fff";
}





// Status related

questionInput.addEventListener('focus',() => {
    status.innerText = 'Typing question';
});

answerInput.addEventListener('focus',() => {
    status.innerText = 'Typing answer';
});

opt1Input.addEventListener('focus',() => {
    status.innerText = 'Creating option 1';
});

opt2Input.addEventListener('focus',() => {
    status.innerText = 'Creating option 2';
});

opt3Input.addEventListener('focus',() => {
    status.innerText = 'Creating option 3';
});

difficulty.addEventListener('focus',() => {
    status.innerText = 'Setting difficulty';
});

key.addEventListener('focus',() => {
    status.innerText = 'Setting creator key';
});

submit.addEventListener('focus',() => {
    status.innerText = 'Submitting quiz';
});



