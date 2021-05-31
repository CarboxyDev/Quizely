console.log('[+] server.js running');
const express = require('express');
const mongoose = require('mongoose');
const {v4:uuid} = require('uuid');
const path = require('path');
const auth = require('./auth');
const utils = require('./utils');
const db = require('./db');
const api = {
    quiz:require('./api/quiz')
}
var server;
require('dotenv').config();

// implement api router soon ffs - [done] 


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
// using api router
app.use('/api/quiz',api.quiz); 









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









app.get('/quiz/create',(req,res) => {
    res.sendFile('create.html',{root:PATH.public});
    console.log('[-] GET : create');
});

app.get('/quiz/play',(req,res) => {
    res.sendFile('quiz.html',{root:PATH.public});
    console.log('[-] GET : quiz');
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

