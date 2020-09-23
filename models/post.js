const mongoose=require('mongoose');
const postSchema=new mongoose.Schema({
    content:{
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    photos:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Photo'
    },
    //include the array of ids of all comments  in this post Schema itself
    comment : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
},
{
    timestamps : true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;