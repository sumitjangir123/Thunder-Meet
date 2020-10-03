const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    teacherId : {
        type : String,
        required : true
    },
    sheetId : {
        type: String,
        required: true
    }
},
{
    timestamps : true
});

const Attendance = mongoose.model('Attendance',attendanceSchema);
module.exports = Attendance;