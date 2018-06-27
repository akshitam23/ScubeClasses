const mongoose =  require('mongoose');
const datef=require('x-date');
const CourseSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
     Course_description:String,
    });
    module.exports=mongoose.model('Course',CourseSchema);
    