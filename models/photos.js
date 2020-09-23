const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const multer= require('multer');
const path= require('path');

//here it converts path into the string
const PHOTO_PATH= path.join('/uploads/users/photos');

const photoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photo: {
        type:String
    }
}, {
    timestamps: true
})


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',PHOTO_PATH));
    },
    filename: function (req, file, cb) {
        //Date.now() is used because if some users uploads the files with same name than that can be overridden so to prevent that.
      cb(null, file.fieldname + '-' + Date.now());
    }
  })

//static methods

photoSchema.statics.uploadPhoto=multer({storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('photo');

photoSchema.statics.photoPath=PHOTO_PATH;

const Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;