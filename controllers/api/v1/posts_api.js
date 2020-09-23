const Post = require('../../../models/user');
const Comment = require('../../../models/comment')
module.exports.index = async function (req, res) {

    let post_list = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user'
            }
        });

    return res.status(200).json({
        message: "list of posts",
        posts: post_list
    })
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id)
        //here we use user.id instead of user._id because user.id convertes object  id into the string 
         if(post.user==req.user.id){
        post.remove();
        await Comment.deleteMany({ post: req.params.id });

        return res.status(200).json({
            message: "Post and Associated Comments Deleted Successfully !"
        });
         } else{
            return res.status(401).json({
                message: "You Cannot Delete This Post !"
            });
         }
    } catch (err) {
        //  req.flash('error','Error in destroying the post');
        //     return res.redirect('/');
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}