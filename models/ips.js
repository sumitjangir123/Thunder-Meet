const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    //comment belong to a user
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Poll'
    }
},
{
    timestamps : true
});

const Ip = mongoose.model('Ip',ipSchema);
module.exports = Ip;