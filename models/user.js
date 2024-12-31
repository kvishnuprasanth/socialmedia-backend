const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const multer=require(('multer'));
const path=require('path');
const AVATAR_PATH=path.join('/socialDraft_frontend/src/assets/uploads/users/avatar');
const AVATAR_PATH_A=path.join('/socialDraft_frontend/src/assets');
const POST_PATH=path.join('/socialDraft_frontend/src/assets/uploads/users/posts');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    }],
    bookmark:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    description:{
        type:String
    },
    avatar:{
        data:Buffer,
        contentType:String
    },
    retweets:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Retweet'
        }
    ],
    photoLocal:{
        type:Boolean
    },
    photoLocal_path:{
        type:String
    }
},{
    timestamps:true
});


// hash password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
})

userSchema.methods.generateAuthToken=async function(){
    try {
        let tok=await jwt.sign({_id:this._id},"something");
        this.tokens=await this.tokens.concat({token:tok})
        await this.save();
        return tok;
    } catch (err) {
        console.log(err);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname=='avatar')
      cb(null, path.join(__dirname,'..','..',AVATAR_PATH))
      else 
      cb(null, path.join(__dirname,'..','..',POST_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
//   const upload = multer({ storage: storage })
//statics
userSchema.statics.uploadedAvatar=multer({ storage: storage }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'postPhoto', maxCount: 1 }
  ]);
userSchema.statics.avatarPath=AVATAR_PATH; 
userSchema.statics.avatarPath_a=AVATAR_PATH_A; 
userSchema.statics.userPostPath=POST_PATH; 

const User=mongoose.model('User',userSchema);

module.exports=User;