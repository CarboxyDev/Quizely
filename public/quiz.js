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



let homeBtn = document.querySelector('.fa-home');
homeBtn.addEventListener('click',() => {
    window.location.replace('/');
});

fetchQuestionCount();
fetchQuestions(5);






let totalQuestionsInDB;
function fetchQuestions(amount){

    let url = window.location.pathname.replace('/quiz','/fetch/5');
    console.log(url);
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


function loadQuestions(){
    console.log(QUESTIONDATA);
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
    
    let optionsList = [
        currentQuestion.answer,
        currentQuestion.option1,currentQuestion.option2,
        currentQuestion.option3
    ];
    shuffleArray(optionsList);
    answer = currentQuestion.answer;

    quiz.option1.innerText = optionsList[0];
    quiz.option2.innerText = optionsList[1];
    quiz.option3.innerText = optionsList[2];
    quiz.option4.innerText = optionsList[3];

    container.option1.setAttribute('onclick',`selectOption('${optionsList[0]}')`);
    container.option2.setAttribute('onclick',`selectOption('${optionsList[1]}')`);
    container.option3.setAttribute('onclick',`selectOption('${optionsList[2]}')`);
    container.option4.setAttribute('onclick',`selectOption('${optionsList[3]}')`);

}




function selectOption(option){
    


}



function fetchQuestionCount(){
    let url = window.location.pathname.replace('/quiz','/utils/db-question-count');
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            totalQuestionsInDB = data.questionCount; 
        });
}





function questionsExhausted(){
    let url = window.location.pathname.replace('/quiz','/questions-exhausted/');
    window.location.replace(url);
}









function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    
}


