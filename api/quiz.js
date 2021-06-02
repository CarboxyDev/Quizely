//   /api/quiz/...
const router = require('express').Router();
const QuizData = require('../models/quizdata');
const utils = require('../utils');
const db = require('../db');
const auth = require('../auth');
const { resolveSoa } = require('dns');


router.get('/test',async(req,res) => {
    res.status(200).json({message:'working'});
});



// keep this router above /fetch/:amt or else the :amt one will always run instead of
// this as it'll take /all as /:amt.

// 1 quiz question object takes 0.22 kb space on average
router.get('/fetch/all',async (req,res) => {
    let allQuizData = await QuizData.find({});
    res.send(allQuizData);
});


router.get('/fetch/:amt',async (req,res) => {
    console.log('/fetch/',req.params.amt);
    /* Current on hold. Needs to be fully revamped.
        Start working when all documents size of quizdata becomes +250kb maybe?

    */
   /*
    let amount = parseInt(req.params.amt);
    if ([5,10,20].includes(amount)){
        let questionCount = await db.questionCount();
        let randList = utils.generateRandomList(amount,questionCount);
        for (x of randList){


        }

    };
    */
});



router.get('/question-count',async (req,res) => {
    let count = await db.questionCount();
    res.json({'questionCount':count});
});








// POST POST POST POST POST POST POST POST POST POST POST
// POST POST POST POST POST POST POST POST POST POST POST
// POST POST POST POST POST POST POST POST POST POST POST

router.post('/create',async(req,res) => {
    let data = req.body;
    let checkCreatorKey = await db.checkCreatorKey(data.key);
    
    if (checkCreatorKey){
        let checkQuiz = await auth.checkQuizItem(data);
        if (checkQuiz[0]){
            data = await auth.alterQuizItem(data);
            let quizObj = {
                difficulty:data.difficulty,
                question:data.question,
                answer:data.answer,
                option1:data.option1,
                option2:data.option2,
                option3:data.option3,
                author:checkCreatorKey.creatorName
            }

            let newQuizItem = db.createQuiz(quizObj);
            if (newQuizItem){
                res.json({
                    'message':'Published submitted quiz item',
                    'success':true,
                    'validKey':true
                });
            }
            else if (!newQuizItem){
                res.json({
                    'message':'Database error in publishing quiz item',
                    'success':false,
                    'validKey':true
                });
            }

        }
        else if (!checkQuiz[0]){
            let reason = checkQuiz[1];
            res.send({
                'message':reason,
                'success':false,
                'validKey':true
            });
        }
    }
    else {
        res.json({
            'message':'Creator key invalid',
            'success':false,
            'validKey':false
        });
    }

});








module.exports = router;
