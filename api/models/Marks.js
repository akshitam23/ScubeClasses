const mongoose =  require('mongoose');
const datef=require('x-date');
const MarksSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    student_id:mongoose.Schema.Types.ObjectId,
    Student_name:String,
    mar:[{
       
       
        Subject:String,
           ExamDate:String,
         ChapterName:String,
            TotalMarks:Number,
            Marks:Number
     
	
}]
    });
    module.exports=mongoose.model('Marks',MarksSchema);
    