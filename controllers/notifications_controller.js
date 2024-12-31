const User=require('../models/user');
const Notification=require('../models/notification');

module.exports.getnotifications=async (req,res)=>{
    try {
        const { page } = req.query;
        const pageSize = 10;
        const skip = (page - 1) * pageSize
        let user=await User.findById( req.user._id);
        let notifications = await Notification.find({
            toEmail : user.email
        }).sort('-createdAt').skip(skip).limit(10)
        .populate({
            path:'Posted',
            select:"-photo"
        }).populate({
            path:'Retweeted',
            select:"-photo",
            populate:{
                path:'retweetedRef',
                select:"-photo",
            }
        }).populate({
            path:'LikedPost',
            select:"-photo"
        }).populate({
            path:'LikedRetweet',
            select:"-photo",
            populate:{
                path:'retweetedRef',
                select:"-photo",
            }
        }).populate({
            path:'Commented',
            populate:{
                path:'commentId'
            }
        }).populate({
            path:'LikedComment',
            populate:{
                path:'commentId'
            }
        }).populate({
            path:'Messaged',
            populate:{
                path:'messageId'
            }
        })

        // console.log(notifications);
        res.status(200).json({notifications})
    } catch (err) {
        console.log("error in getting notifications",err);
        return res.status(500).json({error:err})
    }
}

module.exports.destroy=async (req,res)=>{
    try {
        if(req.params.id){
            await Notification.findByIdAndDelete(req.params.id);
            return res.status(200).json({deleted:true})
        }else{
            return res.status(404).json({message:'id not found'});
        }
    } catch (err) {
        console.log("error in deleting notifications",err);
        return res.status(500).json({error:err})
    }
}