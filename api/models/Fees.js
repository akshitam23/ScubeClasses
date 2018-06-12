const mongoose =  require('mongoose');
const datef=require('x-date');
const FeesSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    student_id :mongoose.Schema.Types.ObjectId,
    Student_name:{type:String,required:true},    
    Fees:Number,
    FeesPaid:[{
       
    HowMuch:Number,
    date:String,
    FeesLeft:Number,
    day:String,
    time:String
    }]
   
    });
    module.exports=mongoose.model('Fees',FeesSchema);
    




