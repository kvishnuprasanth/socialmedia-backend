const User=require('../models/user');
const Retweet=require('../models/retweet');
const Post=require('../models/post');
const Comment=require('../models/comment');
const Bookmark=require('../models/bookmark')
const Like=require('../models/like')
const Follow=require('../models/follow')
const Notification=require('../models/notification')

module.exports.toggleRetweet=async (req,res)=>{
    let user=await User.findById( req.user._id);
    let deleted=false;
    let retweetedpost=await Post.findById(req.query.id);

    let existing=await Retweet.findOne({
        user: req.user._id,
        retweet:req.query.id
    })
    if(existing){
        await Retweet.findOneAndDelete({
        user:req.user._id,
        retweet:req.query.id
        });
        let retweetP=await Post.findOne({
            type:'Retweet',
            user:req.user._id,
            retweetedRef:req.query.id
        }).populate({
            path:'user',
            select:'-avatar'
        }).populate('comments');
        let comments=retweetP.comments;
        await Like.deleteMany({likable:retweetP._id,onModel:'Post'});
        for(comment of comments){
            await Like.deleteMany({_id:{$in:comment.likes}});
        }
        await Comment.deleteMany({post:retweetP._id});
        await Bookmark.deleteMany({bookmark:retweetP._id});

        await Post.findOneAndDelete({
            type:'Retweet',
            user:req.user._id,
            retweetedRef:req.query.id
        })
        user.retweets.pull(existing._id)
        user.save()
        retweetedpost.retweets.pull(existing._id);
        retweetedpost.save();
        deleted=true;
        res.status(200).json({deleted})
    }else{
        let newRetweet=await Retweet.create({
        user: req.user._id,
        retweet:req.query.id
        })
        let post=await Post.create({
            type:'Retweet',
            user:req.user._id,
            retweetedRef:req.query.id
        })
        
        let followers=await Follow.find({
            followable:req.user._id
        }).populate({
            path:'user',
            select:'-avatar'
        })
        for(let follower of followers){
            await Notification.create({
                fromEmail:user.email,
                toEmail:follower?.user?.email,
                typeOf:'Retweeted',
                Retweeted:post._id
            })
        }

        post=await post.populate([
            {path:'user',select:'-avatar'},
            {path:'likes'},
            {path:'retweetedRef',select:'-photo',populate:{path:'user',select:'-avatar'}}
        ])
        user.retweets.push(newRetweet._id)
        user.save();
        retweetedpost.retweets.push(newRetweet._id)
        retweetedpost.save();
        res.status(200).json({deleted,post})
    }
    return ;
}