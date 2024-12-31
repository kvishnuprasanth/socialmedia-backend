const mongoose=require('mongoose');

const CommentedSchema=new mongoose.Schema({
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        default:''
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        default:''
    }
})

const MessagedSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:''
    },
    messageId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
        default:''
    }
})

const NotificationSchema=new mongoose.Schema({
    fromEmail:{
        type:String,
        required:true,
    },
    toEmail:{
        type:String,
        required:true,
    },
    typeOf:{
        type:String,
        required:true,
        enum:['LikedPost','LikedRetweet' ,'LikedComment','Commented', 'Retweeted', 'Messaged', 'Posted']
    },
    read:{
        type:Boolean,
        default:false
    },
    LikedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    LikedRetweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Posted:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Retweeted:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Commented:{
        type : CommentedSchema,
    },
    LikedComment:{
        type : CommentedSchema,
    },
    Messaged:{
        type : MessagedSchema,
    },

},{
    timestamps:true
})

const Notification=mongoose.model('Notification',NotificationSchema);
module.exports=Notification;