const mongoose=require('mongoose');

const retweetSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    retweet:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    }
},{
    timestamps:true
})

const Retweet=mongoose.model('Retweet',retweetSchema);
module.exports=Retweet;