const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    content:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String,
        enum:['Retweet','Post']
    },
    retweetedRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    //include all the ids of comments in an array
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ],
    photo:{
        data:Buffer,
        contentType:String
    },
    isPhoto:{
        type:Boolean,
        default:false
    },
    retweets:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Retweet'
        }
    ],
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);

module.exports=Post;