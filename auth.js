// NOTE : This js file should not contain any database related operations.
// Those go in db.js or any other database related file.
// -lead dev | 31 May 2021


exports.checkQuizItem = async(data) => {
    // didn't bother using switch as i don't like them
    if (data.question.length < 10){
        return [false,'Question should be longer than 10 characters'];
    }
    else if (!["Easy","Moderate","Hard"].includes(data.difficulty)){
        return [false,'You must follow the convention for question difficulty'];
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


exports.alterQuizItem = async(data) => {
    if (!data.question.endsWith('?')){
        if (data.question.endsWith('.') || data.question.endsWith('!')){
            data.question = data.question.slice(0,-1) + "?";
        }
        else {
            data.question += "?";
        }
    }

    return data;
};
