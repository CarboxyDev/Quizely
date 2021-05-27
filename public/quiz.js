let container = {
    option1:document.querySelector('#container-option-1'),
    option2:document.querySelector('#container-option-2'),
    option3:document.querySelector('#container-option-3'),
    option4:document.querySelector('#container-option-4'),
}
let quiz = {
    question:document.querySelector('#question'),
    difficulty:document.querySelector('#difficulty'),
    option1:document.querySelector('#option-1'),
    option2:document.querySelector('#option-2'),
    option3:document.querySelector('#option-3'),
    option4:document.querySelector('#option-4')
}

let color = {
    success:'#4BB543',
    error:'#fa0707',
    option1:'#2973bd',
    option2:'#c92525',
    option3:'#7917ee',
    option4:'#ec4e10'
}



let homeBtn = document.querySelector('.fa-home');
homeBtn.addEventListener('click',() => {
    window.location.replace('/');
});

fetchQuestionCount();
fetchQuestions(5);






let totalQuestionsInDB;
function fetchQuestions(amount){

    let url = window.location.pathname.replace('/quiz','/fetch/5');
    fetch(url)
        .then(res => res.json())
        .then(data => {
            QUESTIONDATA = data;
            loadQuestions();
        });

}





let QUESTIONDATA;
let exhaustedQuestions = [];
let answer;
let answerOption;

function loadQuestions(){
    console.log('[CLIENT] : Loaded next question');
    let currentQuestion = QUESTIONDATA[0];

    if (exhaustedQuestions.length == totalQuestionsInDB){
        questionsExhausted();
    }



    if (QUESTIONDATA.length == 0){
        fetchQuestions(5);
        return true;
    };

    QUESTIONDATA.shift();

    if (exhaustedQuestions.includes(currentQuestion['_id'])){
        loadQuestions();
        return true;
    }

    exhaustedQuestions.push(currentQuestion['_id']);
    
    quiz.question.innerText = currentQuestion.question;
    quiz.difficulty.innerText = currentQuestion.difficulty;
    displayDifficulty(currentQuestion.difficulty);
    
    let optionsList = [
        currentQuestion.answer,
        currentQuestion.option1,currentQuestion.option2,
        currentQuestion.option3
    ];
    shuffleArray(optionsList);
    answer = currentQuestion.answer;
    answerOption = optionsList.indexOf(answer) + 1;


    quiz.option1.innerText = optionsList[0];
    quiz.option2.innerText = optionsList[1];
    quiz.option3.innerText = optionsList[2];
    quiz.option4.innerText = optionsList[3];

    container.option1.setAttribute('onclick',`selectOption('${optionsList[0]}',1)`);
    container.option2.setAttribute('onclick',`selectOption('${optionsList[1]}',2)`);
    container.option3.setAttribute('onclick',`selectOption('${optionsList[2]}',3)`);
    container.option4.setAttribute('onclick',`selectOption('${optionsList[3]}',4)`);

}




function selectOption(optionText,optionNum){
    disableOnclickEvents();
    if (optionText == answer){
        correctAnswer(optionNum);
    }
    else if (optionText != answer){
        wrongAnswer(optionNum);
    }



}

function correctAnswer(optionNum){
    console.log('[CLIENT] : Correct answer');

    let currentElem = document.querySelector(`#container-option-${optionNum}`);
    currentElem.style.backgroundColor = color.success;
    // to not add :hover effect to the option when its green/success
    currentElem.id = "";

    let delay = setInterval(() => {
        resetOptionColors();
        // give its id back for future :hover to take place normally
        currentElem.id = `container-option-${optionNum}`;
        loadQuestions();
        clearInterval(delay);
    },2500);
}



function wrongAnswer(optionNum){
    console.log('[CLIENT] : Wrong answer');
    let currentElem = document.querySelector(`#container-option-${optionNum}`);

    currentElem.style.backgroundColor = color.error;
    // to not add :hover effect to the option when its red/error/wrong
    currentElem.id = "";

    let delay1 = setInterval(() => {
        showAnswer(optionNum,currentElem);
        clearInterval(delay1);


    },1000);


}



function showAnswer(wrongAnswerOptionNum,wrongAnswerElem){

    let currentElem = document.querySelector(`#container-option-${answerOption}`);
    currentElem.style.backgroundColor = color.success;

    let delay2 = setInterval(() => {

        // give its id back for future :hover to take place normally
        
        wrongAnswerElem.id = `container-option-${wrongAnswerOptionNum}`;

        resetOptionColors();
        loadQuestions();
        clearInterval(delay2);
    },2500);

}





function disableOnclickEvents(){
    container.option1.onclick = "";
    container.option2.onclick = "";
    container.option3.onclick = "";
    container.option4.onclick = "";



}





function resetOptionColors(){

    container.option1.style.backgroundColor = color.option1;
    container.option2.style.backgroundColor = color.option2;
    container.option3.style.backgroundColor = color.option3;
    container.option4.style.backgroundColor = color.option4;

    container.option1.classList.add('option-container');
    container.option2.classList.add('option-container');
    container.option3.classList.add('option-container');
    container.option4.classList.add('option-container');



    
}






function fetchQuestionCount(){
    let url = window.location.pathname.replace('/quiz','/utils/db-question-count');
    fetch(url)
        .then(res => res.json())
        .then(data => {
            totalQuestionsInDB = data.questionCount;
            console.log('[DATABASE] Total questions : ',totalQuestionsInDB); 
        });
}




function questionsExhausted(){
    let url = window.location.pathname.replace('/quiz','/questions-exhausted/');
    window.location.replace(url);
}


let difficultyBadge = document.querySelector('#difficulty-badge');

function displayDifficulty(diff){

    if (diff.toLowerCase() == "hard"){
        difficultyBadge.style.backgroundColor = '#e73535';
    }
    else if (diff.toLowerCase() == "moderate"){
        difficultyBadge.style.backgroundColor = '#E5B945';
    }
    else {
        difficultyBadge.style.backgroundColor = '#2ecc71';
    }

}






function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    
}


