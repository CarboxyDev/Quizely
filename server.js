console.log('[+] server.js running');
const express = require('express');
const mongoose = require('mongoose');
const {v4:uuid} = require('uuid');
const path = require('path');
const auth = require('./auth');
const utils = require('./utils');
const db = require('./db');
require('dotenv').config();
var server;

// implement api router soon ffs.


const app = express();
const PORT = process.env.PORT || 2003;


const DATABASE = {
    url:process.env.DB_URL
}

mongoose.connect(DATABASE.url,{useNewUrlParser:true,useUnifiedTopology:true})
    .then((result) => {
        console.log('[+] Connected to database');
        server = app.listen(PORT,() => {
            console.log('[+] Server Online');
        });

    })
    .catch((error) => {
        console.log(error);
        console.log('[-] Failed connecting to database');
        
    });



const PATH = {
    public:path.join(__dirname,'public'),
    home:path.join(__dirname,'home'),
    routes:path.join(__dirname,'routes'),
    error404:path.join(__dirname,'404'),
};


app.use(express.json());
app.use(express.static(PATH.public));
app.use(express.static(PATH.home));
app.use(express.static(PATH.error404));




// DATABASE ROUTES
const QuizData = require('./models/quizdata');
const { resolveSoa } = require('dns');


app.post('/create-quiz',async(req,res) => {
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
        console.log('[x][create-quiz] Someone used an invalid creator key');
        res.json({
            'message':'Creator key invalid',
            'success':false,
            'validKey':false
        });
    }

});




app.get('/api/quiz/fetch/:amt',(req,res) => {
    let amount = parseInt(req.params.amt);
    
    if ([5,10,20].includes(amount)){

        console.log(`[-] GET : /fetch/${amount}`);
        QuizData.countDocuments().exec((error,count) => {
            let randList = utils.generateRandomList(amount,count);
            let collections = [];
            let c = 0;
            for (x of randList){
                QuizData.findOne().skip(x).exec((error,data) => {
                    c++;
                    collections.push(data);
                    if (c == amount){
                    
                        res.send(collections);
                    }

                });

            }
        });
    }

    
});


app.get('/creator/new',async (req,res) => {
    console.log('[-] GET : /creator/new');
    let key = req.query.key;
    let author = req.query.author;
    let adminPwd = req.query.admin;
    
    if (adminPwd == process.env.ADMIN_PWD){
        if (key && author){
            let doesKeyExists = await db.checkCreatorKey(key);
            if (!doesKeyExists){
                console.log(`[+] New Creator -  ${key} : ${author}`);
                let sendObj = {
                    key:key,
                    creatorName:author
                }
                let newCreator = await db.newCreator(sendObj);
                res.json(sendObj);    
            }
            else if (doesKeyExists){
                res.send('This key already exists');
            }
    
        }
        else {
            res.send('Invalid query');
        }
    }
    else {
        res.send('Invalid admin password');
    }


});

app.get('/creator/remove', async (req,res) => {
    console.log('[-] GET : /creator/remove');
    let key = req.query.key;
    let adminPwd = req.query.admin;
    
    if (adminPwd == process.env.ADMIN_PWD){
        if (key){
            let checkCreatorKey = await db.checkCreatorKey(key);
            let removeKey = await db.removeCreator(key);
            
            if (removeKey.deletedCount >= 1){
                console.log('[+] Removed a creator key from database');
    
                res.json({
                    key:key,
                    creatorName:checkCreatorKey.creatorName,
                    count:removeKey.deletedCount,
                    success:true,
                    message:'The key was successfully removed from database'                
                });
            }
            else {
                res.send('That key does not exist');
            }
        }
        else {
            res.send('Invalid query');
        }
    }
    else {
        res.send('Invalid admin password');
    }

});









app.get('/create-quiz',(req,res) => {
    res.sendFile('create.html',{root:PATH.public});
    console.log('[-] GET : create');
});

app.get('/quiz/play',(req,res) => {
    res.sendFile('quiz.html',{root:PATH.public});
    console.log('[-] GET : quiz');
}); 

app.get('/api/quiz/question-count',(req,res) => {
    QuizData.countDocuments().exec((error,count) => {
        res.json({'questionCount':count});
    });
});

app.get('/questions-exhausted',(req,res) => {
    res.sendFile('questions-exhausted.html',{root:PATH.public});
    console.log('[-] GET : questions-exhausted');    
});


app.get('/',(req,res) => {
    res.sendFile('home.html',{root:PATH.home});

});

app.use('*',(req,res) => {
    res.sendFile('404.html',{root:PATH.error404});

});

