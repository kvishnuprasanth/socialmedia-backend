const mongoose=require('mongoose');

const bookmarkSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bookmark:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    }
},{
    timestamps:true
})

const Bookmark=mongoose.model('Bookmark',bookmarkSchema);
module.exports=Bookmark;