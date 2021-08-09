//   /api/quiz/...
const router = require('express').Router();
const QuizData = require('../models/quizdata');
const { resolveSoa } = require('dns');



// 1 quiz question object takes 0.22 kb space on average
router.get('/fetch/all',async (req,res) => {
    let allQuizData = await QuizData.find({});
    res.send(allQuizData);
});



router.get('/question-count',async (req,res) => {
    console.log('[API] quiz -> question-count');
    let count = await db.questionCount();
    res.json({'questionCount':count});
    
});






router.post('/create',async(req,res) => {
    let data = req.body;
    let checkCreatorKey = await db.checkCreatorKey(data.key);
    
    if (checkCreatorKey){
        let checkQuiz = await auth.checkQuizItem(data);
        if (checkQuiz[0]){
            data = await auth.formatQuizItem(data);
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
