const mongoose=require('mongoose');
const pollSchema=new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    //include the array of ids of all comments  in this post Schema itself
    choices : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Choice'
    }],
    ip:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Ip'
    }]
},
{
    timestamps : true
});

const Poll=mongoose.model('Poll',pollSchema);
module.exports=Poll;