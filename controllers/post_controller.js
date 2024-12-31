const Post=require('../models/post');
const Comment=require('../models/comment');
const User=require('../models/user')
const Bookmark=require('../models/bookmark')
const Like=require('../models/like')
const Retweet=require('../models/retweet')
const fs=require('fs');
const path=require('path');
const formidable=require('formidable')
const Follow=require('../models/follow');
const Notification=require('../models/notification');

module.exports.create=async (req,res)=>{
    try {
        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
        let user=await User.findById(req.user._id)
            const {postPhoto}=files
            let newpost=await Post.create({
                content:fields.content,
                user:req.user._id
            });

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
                    typeOf:'Posted',
                    Posted:newpost._id
                })
            }

            user.posts.push(newpost)
            if(files.postPhoto){
                newpost.photo.data=fs.readFileSync(postPhoto.filepath);
                newpost.photo.contentType=postPhoto.mimetype;
                newpost.isPhoto=true;
            }
            user.save();
            newpost.save();
            let post=await Post.findById(newpost._id)
            .select("-photo")
            .populate({
                path:'user',
                select:'-avatar'
            })
            if(files.postPhoto) post.isPhoto = true;
        return res.status(200).json({post})
    })
    } catch (error) {
        return res.status(500).json({error:error})
  }
}

module.exports.destroy=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id).populate('user').populate('comments');
        let comments=await post.comments
        if(post.user.id==req.user._id){
            await Like.deleteMany({likable:post._id,onModel:'Post'});
            for(comment of comments){
                await Like.deleteMany({_id:{$in:comment.likes}});
            }
            await Comment.deleteMany({post:req.params.id});
            await User.findByIdAndUpdate(post.user._id,{$pull:{posts:req.params.id}});
            await Bookmark.deleteMany({bookmark:req.params.id});
            // if(post.photo){
            //     fs.unlinkSync(path.join(__dirname,'..','..',post.photo));
            // }

                let retweetedPosts=await Post.find({
                    type:'Retweet',
                    retweetedRef:req.params.id
                })

                for(retweetedPost of retweetedPosts){
                    let retweet=await Post.findById(retweetedPost._id).populate('user').populate('comments')
                    let retweetcomments=await retweet.comments
                        await Like.deleteMany({likable:retweet._id,onModel:'Post'});
                        for(retweetcomment of retweetcomments){
                            await Like.deleteMany({_id:{$in:retweetcomment.likes}});
                        }
                        await Comment.deleteMany({post:retweet._id});
                        await Bookmark.deleteMany({bookmark:retweet._id});
                        let retweetedUser=await User.findById(retweet.user._id);
                        let existingretweet=await Retweet.findOne({
                            user: retweetedUser._id,
                            retweet:req.params.id
                        })
                        retweetedUser.retweets.pull(existingretweet._id)
                        retweetedUser.save();
                        await Retweet.findByIdAndDelete(existingretweet._id);
                        await Post.findByIdAndDelete(retweet._id);
                }

                await Post.findByIdAndDelete(post._id);
            return res.status(200).json({msg:"sucessfully deleted post"});
        }else{
            return res.status(402).json({msg:"can't delete post"})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error})
    }
}

module.exports.yourposts=async (req,res)=>{
    try {
    let user=await User.findById(req.user._id).populate({
        path:'posts',
        select:"-photo"
    });
    let yourposts=await user.posts.reverse();
    return res.status(200).json({yourposts});
    } catch (err) {
    return res.status(500).json({err});   
    }
}

module.exports.yourretweets=async (req,res)=>{
    try {
    let user=await req.user.populate({
        path:'retweets',
        populate:{
            path:'retweet',
            select:"-photo",
            populate:{
                path:'user',
                select:'-avatar'
            }
        }
    });
    let yourretweets=await user.retweets.reverse();
    return res.status(200).json({yourretweets});
    } catch (err) {
    return res.status(500).json({err});   
    }
}

module.exports.getpost=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id).select("-photo")
        .populate({
            path:'user',
            select:'-avatar'
        })
        .populate({
            path:'retweetedRef',
            select:"-photo",
            populate:{
                path:'user',
                select:'-avatar'
            }
        })
    return res.status(200).json({post})
    } catch (err) {
        return res.status(404).json({err})   
    }
}

module.exports.savedposts=async (req,res)=>{
    try {
        const { page } = req.query;
        const pageSize = 10;
        const skip = (page - 1) * pageSize
    let savedposts=await Bookmark.find({user:req.user._id})
    .sort('-createdAt').skip(skip).limit(10)
    .populate({
        path:'bookmark',
        select:'-photo',
        populate:[{
            path:'user',
            select:'-avatar'
        },
        {path:'retweetedRef',
        select:'-photo',
        populate:{
            path:'user',
            select:'-avatar'
        }}
    ]         
    })
    return res.status(200).json({savedposts})

    } catch (err) {
    return res.status(404).json({err})
    }
}

module.exports.postPhoto=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id).select('photo');
        if(post.photo.data){
            res.set('Content-type',post.photo.contentType)
            return res.status(200).send(post.photo.data)
        }
        
    } catch (error) {
        console.log(error);
    }
}