const mongoose=require('mongoose');

const followSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    followable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Follow=mongoose.model('Follow',followSchema);
module.exports=Follow;