require('dotenv').config();
const express = require('express');
const cookieParser=require('cookie-parser');
const path=require('path')
const app = express();
const db = require('./config/mongoose');
const PORT=process.env.PORT || 8000;
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const passportFacebook=require('./config/passport-facebook-strategy')
const MongoStore = require('connect-mongo');
const socket = require("socket.io");

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors=require("cors");
const Notification = require('./models/notification');
app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
// app.use(cors({ 
//   origin: ["http://localhost:5173", "https://socialdraft.netlify.app","http://localhost:8000"],
//   credentials: true,
// }));
// app.use(
//   cors({
//     exposedHeaders: ['X-Total-Count'],
//   })
// );

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('dist'));
app.use('/photo',express.static(path.join(__dirname,'/assets')));

app.use(session({
    name:process.env.SESSION_NAME,
    secret:process.env.SESSION_SECRET,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create(
        { 
            mongoUrl: process.env.MONGOOSE_URL
         },function(err){
          console.log(err);
         }
         )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./routes')); 

const server =app.listen(PORT,(err)=>{
    if(err) console.log("error in running server",err);
    console.log(`Server is successfully running on port: ${PORT}`); 
})

//socket.io
const io = socket(server, {
  cors: {
    origin: ["https://socialdraft.netlify.app","http://localhost:5173","http://localhost:8000","https://socialdraft.onrender.com"],
    credentials: true,
  },
});

//different landSpace for posts
// const postsNamespace = ;

io.of("/posts").on("connection", (socket) => {
  socket.on('uploadedPost',(data)=>{
    io.of("/posts").emit('postarrived',data);
  })
});

global.onlineUsers = new Map();
io.of('/chat').on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", async (data) => {
    const sendUserSocket = await onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }else{
      await Notification.create({
        fromEmail:data.fromEmail,
        toEmail:data.toEmail,
        typeOf:'Messaged',
        Messaged:{
          userId:data.userId,
          messageId:data.messageId
        }
      })
    }
  });
  socket.on('disconnect',()=>{
    console.log('user disconnected', socket.id);
    global.onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        global.onlineUsers.delete(key);
        console.log('Deleted user with ID:', key);
      }
    });
  })
});