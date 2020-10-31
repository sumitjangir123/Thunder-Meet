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
    }
},{
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
