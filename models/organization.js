const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    // the user who sent this request
    admin: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    organization: {
        type: String,
        required:true
    },
    acronym: {
        type: String,
        required:true
    },
    motto: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    token:{
        type:String,
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
}]
    
}, {
    timestamps: true
});

const Organization = mongoose.model('Organization', orgSchema);
module.exports = Organization;
