console.log('[+] Running server.js');

const express = require('express');
const mongoose = require('mongoose');
const {v4:uuid} = require('uuid');
const path = require('path');
global.auth = require('./auth');
global.utils = require('./utils');
global.db = require('./db');
const api = {
    quiz:require('./api/quiz'),
    creator:require('./api/creator'),
}
var server;
require('dotenv').config();




const app = express();
const PORT = process.env.PORT || 3000;


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
    routes:path.join(__dirname,'routes'),
    home:path.join(__dirname,'pages/home'),
    quiz:path.join(__dirname,'pages/quiz'),
    error404:path.join(__dirname,'pages/404'),
    quizExhausted:path.join(__dirname,'pages/quiz-exhausted'),
    create:path.join(__dirname,'pages/create'),
    info:path.join(__dirname,'pages/info'),
};


app.use(express.json());
app.use(express.static(PATH.public));
app.use(express.static(PATH.home));
app.use(express.static(PATH.quiz));
app.use(express.static(PATH.error404));
app.use(express.static(PATH.quizExhausted));
app.use(express.static(PATH.create));
app.use(express.static(PATH.info));


// using api router
app.use('/api/quiz',api.quiz); 
app.use('/api/creator',api.creator);












// query based editing of quiz items
// maybe add an actual page/interface for doing this stuff huh?
app.get('/quiz/edit',async (req,res) => {
    if (req.query.admin == process.env.ADMIN_PWD){
        if (req.query.id){
            let id = req.query.id;
            delete req.query.admin;
            delete req.query.id;
            for (x of Object.keys(req.query)){
                let prop = x;
                let editQuiz = await db.editQuiz(id,prop,req.query[x]);
                res.json(editQuiz);
            }
        }
        else {
            res.send('Invalid question id');
        }
    }
    else {
        res.send('Invalid admin password');
    }
});


app.get('/quiz/delete',async (req,res) => {
    if (req.query.admin){
        if (req.query.id){
            let deleteQuiz = await db.deleteQuiz(req.query.id);
            res.json(deleteQuiz);
        }
        else {
            res.send('Invalid question id');
        }
    }
    else {
        res.send('Invalid admin password');
    }
});





app.get('/quiz/create',(req,res) => {
    res.sendFile('create.html',{root:PATH.create});
    console.log('[-] GET : create');
});

app.get('/quiz/play',(req,res) => {
    res.sendFile('quiz.html',{root:PATH.quiz});
    console.log('[-] GET : quiz');
}); 



app.get('/quiz/quiz-exhausted',(req,res) => {
    res.sendFile('quiz-exhausted.html',{root:PATH.quizExhausted});
    console.log('[-] GET : quiz-exhausted');    
});

app.get('/info',(req,res) => {
    res.sendFile('info.html',{root:PATH.info});
    console.log('[-] GET : info');
})


app.get('/',(req,res) => {
    res.sendFile('home.html',{root:PATH.home});

});

app.use('*',(req,res) => {
    res.sendFile('404.html',{root:PATH.error404});

});

