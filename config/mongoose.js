const mongoose = require('mongoose');
//connecting to mongoDB
mongoose.connect(process.env.MONGOOSE_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;