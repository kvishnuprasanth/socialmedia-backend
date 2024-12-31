const Post=require('../models/post')

module.exports.home=async (req,res)=>{
    try {
        const { page } = req.query;
        const pageSize = 10;
        const skip = (page - 1) * pageSize
    let posts=await Post.find({}).select("-photo")
    .sort('-createdAt').skip(skip).limit(10)
    .populate({
        path:'user',
        select:'-avatar'
    })
    .populate('likes')
    .populate({
        path:'retweetedRef',
        select:'-photo',
        populate:{
            path:'user',
            select:'-avatar'
        }
    })
    return res.status(200).json({posts})
        
    } catch (err) {
        return res.status(401).json({msg:"error in sending post",error:err})        
    }

}