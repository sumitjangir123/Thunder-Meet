const Post = require("../models/post");
const  Comment= require('../models/comment');
const User = require('../models/user');
const Like= require('../models/like');
const Photo= require('../models/photos');
module.exports.create =async function (req, res) {
    
    try {
 
          await Photo.uploadPhoto(req,res,function(err){
            if(err){ console.log('****multer error',err);}

            if(req.file){
                
                //here we have to use photos._id to refer the photos schema so that "then" is used to wait for the promises to complete otherwise they will be in pending state
                let photos = Photo.create({
                    user: req.user._id,
                    photo: Photo.photoPath + '/' + req.file.filename
                }).then(async function(result){
                    
                    let post= await Post.create({
                        content : req.body.content,
                        user : req.user._id,
                        photos : result._id 
                    })

                    if(req.xhr){
                        //we only want to populate the name of the user 
                        post =await post
                        .populate('user','name avatar')
                        .populate('photos').execPopulate();
                        return res.status(200).json({
                            data: {
                                post:post
                            },
                            message: 'Post Created !'
                        })
                    }
               
                });
            }
        })

    }catch (err) {
        req.flash('error','Error in creating a post');
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.destroy =async function(req,res){
   try {
    let post= await Post.findById(req.params.id);
    
        //here we use user.id instead of user._id because user.id convertes object  id into the string 
        if(post.user==req.user.id){

            await Like.deleteMany({
                likeable:post._id,
                onModel: 'Post'
            });

            await Like.deleteMany({_id:{$in: post.comment}});

            post.remove();
            await Comment.deleteMany({post : req.params.id});
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                });
            }
            req.flash('success','Post And Related Comments are Deleted !')
            return res.redirect('back');
        } else {
            req.flash('error','You Are Not The Authorised User !')
            return res.redirect('back');
        }
   } catch (err) {
    req.flash('error','Error in destroying the post');
       return res.redirect('/');
   }
}