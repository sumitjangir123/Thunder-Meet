const mongoose=require('mongoose');
const passwordToken=new mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    token: {
        type : String
    },
    createdAt: { type: Date, expires: '5m', default: Date.now }
},
{
    timestamps : true
});

const resetPasswordToken=mongoose.model('resetPasswordToken',passwordToken);
module.exports=resetPasswordToken;