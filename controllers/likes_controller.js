const Like = require('../models/like');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports.toggleLike = async function (req, res) {
    try {

        let likeable;
        let deleted = false;

        if (req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like is already exists then delete it

        let existingLike = await Like.findOne({
            user: req.user._id,
            onModel: req.query.type,
            likeable: req.query.id
        })

        //if like is already exists
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted=true;
        } else {
            //else make a new like

            let newLike= await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            }) 

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: 'request successful',
            data: {
                deleted: deleted 
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Internal Server Error !'
        })
    }
}