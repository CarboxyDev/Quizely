const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creatorSchema = new Schema({

    key : {
        type:String,
        required:true
    },

    creatorName : {
        type:String,
        required:true
    },

    role : {
        type:String,
        default:'Creator'
    }
},{timestamps:true});


const Creator = mongoose.model('creator',creatorSchema);

module.exports = Creator;