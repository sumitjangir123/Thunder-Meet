const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    branch:{
        type:String
    }
    ,year:{
        type:String
    },
    startFrom:{
        type:String
    },
    moderator:{
        type:String
    },
    classOf:{
        type:String
    },
    meetLinks: {
        type: String
    },
    localLinks:{
        type:String
    },
    createdAt: { type: Date, expires: '2880m', default: Date.now }
},{
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
