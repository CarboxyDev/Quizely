questionCount();

















function questionCount(){
    let url = '/api/quiz/question-count';
    fetch(url)
        .then(res => res.json())
        .then(data=> {
            console.log('[CLIENT] Fetched question count.');
            let questionCountLabel = document.querySelector('#questions');
            questionCountLabel.innerText = data.questionCount;
        })
}



