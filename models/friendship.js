const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    // the user who sent this request
    classOf:{
        type:String
    },
    meetLinks: {
        type: String
    },
    localLinks:{
        type:String
    },
    createdAt_1: { type: Date, expires: '45m', default: Date.now }
},{
    timestamps: true
});

const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;
