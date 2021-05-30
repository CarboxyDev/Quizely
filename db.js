const Creator = require('./models/creator');
const QuizData = require('./models/quizdata');
const { resolveSoa } = require('dns');

exports.newCreator = async (creatorObj) => {

    let creator = new Creator(creatorObj);
    creator.save()
        .then(result => {
            console.log(`[+] New creator added to database`);
            return true;
        })
        .catch(error => {
            console.log(error);
            console.log('[x] Error in saving new creator to database');
            return false;
        });

};

exports.createQuiz = async(quizObj) => {
    let quizItem = new QuizData(quizObj);
    quizItem.save()
        .then(result => {
            console.log('[+] New quiz item created');

            return true;
        })
        .catch(error => {
            console.log(error);
            console.log('[x] Database error in creating quiz item');
            return false;
        })
}



