const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    teacher : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required :true
    },
    branch : {
        type: String,
        required: true
    },
    student : {
        type: String,
        required : true 
    },
    duration :{
        type: Number,
        required: true
    },
    year :{
        type : Number,
        required: true
    }
},
{
    timestamps : true
});

const Attendance = mongoose.model('Attendance',attendanceSchema);
module.exports = Attendance;