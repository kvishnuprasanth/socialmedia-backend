const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');
const Follow = require('../models/follow');
const Notification = require('../models/notification');
const User = require('../models/user');

module.exports.toggleLike=async (req,res)=>{
    try {
        let likable;
        let deleted=false;
        if(req.query.type=='Post'){
            likable=await Post.findById(req.query.id);
        }else{
            likable=await Comment.findById(req.query.id);
        }
        let existingLike=await Like.findOne({
            likable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();
           await  Like.findOneAndRemove({
                likable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
            })
            deleted=true;
        }else{
            let newLike=await Like.create({
                user:req.user._id,
                likable:req.query.id,
                onModel:req.query.type
            });
            //Notification
            let follow = await Follow.find({
                user:likable.user,
                followable:req.user._id
            })
            if(req.query.type=='Post'){
                if(likable.type==='Retweet'){
                    if(follow && follow?.length != 0){
                        // console.log(follow);
                        let toEmailUser=await User.findById(likable.user);
                        await Notification.create({
                            fromEmail:req.user.email,
                            toEmail:toEmailUser.email,
                            typeOf:'LikedRetweet',
                            LikedRetweet:likable._id
                        })
                    }
                }else{
                    if(follow && follow?.length != 0){
                        // console.log(follow);
                        let toEmailUser=await User.findById(likable.user);
                        await Notification.create({
                            fromEmail:req.user.email,
                            toEmail:toEmailUser.email,
                            typeOf:'LikedPost',
                            LikedPost:likable._id
                        })
                    }
                }
            }else{
                if(follow && follow?.length != 0){
                    let toEmailUser=await User.findById(likable.user);
                    await Notification.create({
                        fromEmail:req.user.email,
                        toEmail:toEmailUser.email,
                        typeOf:'LikedComment',
                        LikedComment:{
                            commentId:likable._id,
                            postId:likable.post
                        }
                    })
                }
            }

            likable.likes.push(newLike._id);
            likable.save();
        }
        return res.status(200).json({deleted:deleted})
    } catch (err) {
        return res.status(404).json({error:`error in making a like :-${err}`}) ;
    }
}