const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    //comment belong to a user
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    value : {
        type : String,
        required : true
    }
},
{
    timestamps : true
});

const Choice = mongoose.model('Choice',choiceSchema);
module.exports = Choice;