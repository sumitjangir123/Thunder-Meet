const mongoose=require('mongoose');
const env= require('./environment');
mongoose.connect(`mongodb://localhost/${env.db}`,{ useNewUrlParser: true, useUnifiedTopology: true });
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'));
db.once('open',function(){
    console.log('sucessfully connected to the database ');
});

module.exports =db;