const mongoose =  require('mongoose');

const FacultySchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Faculty_Qualification:String,
    Faculty:String,
    Faculty_Photo:String
    });
    module.exports=mongoose.model('Faculty',FacultySchema);
    