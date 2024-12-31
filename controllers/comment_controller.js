const Comment=require('../models/comment')
const Post=require('../models/post')
const Like=require('../models/like')
const Follow=require('../models/follow')
const Notification=require('../models/notification')
const User=require('../models/user')

module.exports.create=async (req,res)=>{
    try {
     let post=await Post.findById(req.body.post);
     let comment;
     if(post){
         comment=await Comment.create({
             content:req.body.content,
             post:req.body.post,
             user:req.user._id
         });

         let follower = await Follow.find({
            user:post.user,
            followable:req.user._id
         })
         let toEmailUser=await User.findById(post.user)
         if(follower && follower?.length !== 0){
            await Notification.create({
                fromEmail:req.user.email,
                toEmail:toEmailUser.email,
                typeOf:'Commented',
                Commented:{
                    commentId:comment._id,
                    postId:post._id,
                }
            })
         }

         comment=await comment.populate({
            path:'user',
            select:'-avatar'
         });
         post.comments.push(comment);
         post.save();
         res.status(200).json({comment})
     }
    } catch (err) {
     console.log("error in creating the comment",err);
     return res.status(404).json({error:err}) ;
    }
 }

 module.exports.destroy=async (req,res)=>{
    try {
        let comment=await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
        let postId=comment.post;
        await Comment.findByIdAndDelete(comment.id);
        await Like.deleteMany({likable:comment._id,onModel:'Comment'});
        await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
        return res.status(200).json({msg:"sucessfully deleted comment"})
    }else{
        return res.status(402).json({msg:"can't delete comment"})
    }
    } catch (err) {
        console.log("error in deleting the comment",err);
        return res.status(500).json({error:err})
    }
}

 module.exports.getcomments=async (req,res)=>{
    try {
        const { page } = req.query;
        const pageSize = 10;
        const skip = (page - 1) * pageSize
        let comments=await Comment.find({
            post:req.params.id
        }).skip(skip).limit(10)
        .populate({
            path:'user',
            select:'-avatar'
        })
        return res.status(200).json({comments})
        
    } catch (err) {
        console.log("error in deleting the comment",err);
        return res.status(500).json({error:err})
    }
}