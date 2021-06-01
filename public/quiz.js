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


// for using CSS variables
const style = getComputedStyle(document.body);
let color = {
    success:style.getPropertyValue('--success'),
    error:style.getPropertyValue('--error'),
    easy:style.getPropertyValue('--lightgreen'),
    moderate:style.getPropertyValue('--yellow'),
    hard:style.getPropertyValue('--lightred'),
    option1:style.getPropertyValue('--blue'),
    option2:style.getPropertyValue('--red'),
    option3:style.getPropertyValue('--purple'),
    option4:style.getPropertyValue('--orange'),
}

function home(){
    window.location.replace('/');
}

var DATA = {
    quiz:undefined,
    questionCount:undefined,
    exhausted:[],
    currentAnswer:undefined
}




function generateQuestion(){
    console.log('[CLIENT] Loaded question');
    if (DATA.quiz.length == 0){
        exhaustedQuiz();
        return;
    }
    let currentQuestion = DATA.quiz[0];
    DATA.quiz.shift();// remove 0th element from quiz data
    DATA.exhausted.push(currentQuestion['_id']);
    displayQuestion(currentQuestion);
    displayDifficulty(currentQuestion.difficulty);
}


function displayQuestion(currentQuestion){
    quiz.question.innerText = currentQuestion.question;

    let options = [
        currentQuestion.answer,currentQuestion.option1,
        currentQuestion.option2,currentQuestion.option3
    ];
    shuffleArray(options);
    DATA.currentAnswer = options.indexOf(currentQuestion.answer) + 1;

    quiz.option1.innerText = options[0];
    quiz.option2.innerText = options[1];
    quiz.option3.innerText = options[2];
    quiz.option4.innerText = options[3];
    container.option1.onclick = selectOption;
    container.option2.onclick = selectOption;
    container.option3.onclick = selectOption;
    container.option4.onclick = selectOption;
}




function displayDifficulty(diff){
    let difficultyBadge = document.querySelector('#difficulty-badge');
    quiz.difficulty.innerText = diff;
    if (diff.toLowerCase() == "hard"){
        difficultyBadge.style.backgroundColor = color.hard;
    }
    else if (diff.toLowerCase() == "moderate"){
        difficultyBadge.style.backgroundColor = color.moderate;
    }
    else {
        difficultyBadge.style.backgroundColor = color.easy;
    }

}


function selectOption(event){
    disableOnclickEvents(); // doesn't allow client to click multiple options
    let chosenElem = this; // gives option container's div
    let chosenOption = chosenElem.getAttribute('data-option');
    if (chosenOption == DATA.currentAnswer){
        correctAnswer(chosenElem);
    }
    else {
        wrongAnswer(chosenElem);
    };
}   


function correctAnswer(chosenElem){
    chosenElem.classList.add('option-correct');

    let delay = setInterval(() => {
        chosenElem.classList.remove('option-correct');
        clearInterval(delay);
        generateQuestion();
    },2500);
}



function wrongAnswer(chosenElem){
    chosenElem.classList.add('option-wrong');

    let delay = setInterval(() => {
        clearInterval(delay);
        showAnswer(chosenElem);
    },1000)
}


function showAnswer(chosenElem){
    let answerElem = document.querySelector(`[data-option="${DATA.currentAnswer}"]`);
    answerElem.classList.add('option-correct');

    let delay2 = setInterval(() => {
        answerElem.classList.remove('option-correct');
        chosenElem.classList.remove('option-wrong');
        clearInterval(delay2);
        generateQuestion();
    },2500);
}








function fetchAllQuestions(){
    let url = '/api/quiz/fetch/all';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            DATA.quiz = data;
            shuffleArray(DATA.quiz);
            DATA.questionCount = data.length;
            console.log('[CLIENT] Fetched questions from database');
            console.log(`Questions Fetched Amount : ${DATA.questionCount}`);
            generateQuestion();
        })
}


document.addEventListener('DOMContentLoaded',() => {
    fetchAllQuestions();
});



function exhaustedQuiz(){
    window.location.replace('/quiz/quiz-exhausted');
}


function disableOnclickEvents(){
    container.option1.onclick = "";
    container.option2.onclick = "";
    container.option3.onclick = "";
    container.option4.onclick = "";
}


function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    
}


