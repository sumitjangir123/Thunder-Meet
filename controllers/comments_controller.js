const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })

            post.comment.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            // commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function (err) {
                if (err) { console.log('error in creating a queue', err); return; }

                console.log('job enqueued', job.id)
            })
            if (req.xhr) {
                // Similar for comments to fetch the user's id!


                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }
            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    } catch (err) {
        console.log('Error', err); return;
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);


        //we need to delete object id of comment from 1.array that is present in post model and 2.the comment itself from the comment model for that we have to store the postId of comment 
        //because we dont want to lose it after deleting the 2. we have to delete 1. also
        let postId = comment.post;

        //find a post using the postId
        let post = await Post.findById(postId);


        //if the user of post wants to delete any unappropriate comment from that post that is commented by anyone so for that kind of authorisation
        if (post.user == req.user.id) {

            await Like.deleteMany({
                likeable: comment._id,
                onModel: 'Comment'
            });

            //comment deleted
            comment.remove();

            //comment id is also poped out from the array of comments
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comment: req.params.id } });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Comment is destroyed');
            return res.redirect('back');
        }
        //if user who is commented on any post and want to take back that comment or wants to delete that comment than he/she is able to do that :)
        else {
            if (comment.user == req.user.id) {
                comment.remove();
                let post = await Post.findByIdAndUpdate(postId, { $pull: { comment: req.params.id } });
                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            comment_id: req.params.id
                        },
                        message: "Post deleted"
                    });
                }
                req.flash('success', 'Comment is destroyed');
                return res.redirect('back');
            }
            else {
                req.flash('error', 'you are not the authorized user');
                return res.redirect('back');
            }
        }

        // send the comment id which was deleted back to the views


    } catch (err) {
        req.flash('error', 'Error in deleting the comment !');
        return res.redirect('back');
    }
}