const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizDataSchema = new Schema({

    author : {
        type:String,
        required:true
    },

    question : {
        type: String,
        required:true
    },

    answer : {
        type: String,
        required:true
    },

    option1 : {
        type: String,
        required:true
    },

    option2 : {
        type: String,
        required:true
    },

    option3 : {
        type: String,
        required:true
    },
    
    difficulty : {
        type: String,
        required: true
    }


},{timestamps:true});


const QuizData = mongoose.model('quizdata',quizDataSchema);

module.exports = QuizData;
