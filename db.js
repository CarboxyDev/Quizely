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

exports.removeCreator = async (key) => {
    let remove = await Creator.deleteMany({key:key});

    return remove;

}





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


exports.checkCreatorKey = async(key) => {
    let creator = await Creator.findOne({key:key});
    if (creator == null || creator == undefined){

        return false;
    };
    return creator;
};

// or maybe just count the questions once every hour and store in a variable?
// will save the request from client for the amount
// of questions or any server side use
exports.questionCount = async() => {
    let docsCount = await QuizData.countDocuments();
    if (docsCount == null || docsCount == undefined){
        return null;
    }
    return docsCount;
}

