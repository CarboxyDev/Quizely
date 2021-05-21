exports.checkCreatorKey = (data) => {

    if (Object.keys(KEYS).includes(data.key)){
        return true;
    }
    return false;
    
};


exports.checkQuizItem = (data) => {
    if (data.question.length < 10){
        return [false,'Question should be longer than 10 characters'];
    }
    else if (!["Easy","Moderate","Hard"].includes(data.difficulty)){
        return [false,'You must specify a difficulty level for the quiz item'];
    }
    else if (data.answer.length == 0){
        return [false,'You forgot to specify an answer'];
    }
    else if (data.option1.length == 0){
        return [false,'You forgot to specify option 1'];
    }
    else if (data.option2.length == 0){
        return [false,'You forgot to specify option 2'];
    }
    else if (data.option3.length == 0){
        return [false,'You forgot to specify option 3'];
    }
    else {
        return [true,'Success'];
    }

};


exports.alterQuizItem = (data) => {

    return data;
};
