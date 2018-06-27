const express = require('express');
const app = express();
const morgan=require('morgan');
const cors=require('cors')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const Nexmo=require('nexmo');
const socketio=require('socket.io');
const StudentRoutes=require('./api/routes/Student')
const AdminRoutes=require('./api/routes/Admin')
const UserRoutes=require('./api/routes/User')

// 
// const sms = require('free-mobile-sms-api');
 
// sms.account(7016371094,'myPrivateKey');
// sms.send("Hello world!");

// sms.on('sms:error', function(e) {
//   console.log(e.code + ": " + e.msg);
// });
 
// sms.on('sms:success', function(data) {
//   console.log("Success! :D");
// });
mongoose.connect('mongodb://aksh:akshita@cluster0-shard-00-00-frps1.mongodb.net:27017,cluster0-shard-00-01-frps1.mongodb.net:27017,cluster0-shard-00-02-frps1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.use(function (req, res, next) {
//     // res.setHeader('Access-Control-Allow-Origin', 'TRUE');
//      res.header('Access-Control-Allow-Headers', 'Origin,Authorization, X-Requested-With, Content-Type, Accept');
    
//      res.header('Access-Control-Allow-Credentials', 'true');
//  res.header('Access-Control-Allow-Origin', req.get('origin')); 

//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

//      next();
//    });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,Authorization, X-Requested-With, Content-Type, Accept "
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/Student',StudentRoutes);
app.use('/Admin',AdminRoutes);
app.use('/User',UserRoutes);
app.use((req,res,next) =>
{
const error=new Error('Not found');
error.status=404;
next(error);
});
app.use((error,req,res,next)=>{console.log("kjjyg")
res.status(error.status||500);

res.json({
   
    error:{
        message:"Server  Error",
    error:error }
});
});


module.exports=app;
