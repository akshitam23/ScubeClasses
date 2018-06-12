const mongoose =  require('mongoose');
const datef=require('x-date');
const StudentSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Student_name:String,
    Father_name:String,
    Mother_name:String,
    Father_occupation:String,
    Mother_occupation:String,
    father_contact_number:Number,
    mother_contact_number:Number,
    School_name:String,
    Sibling_name:String,
    Class:Number,
    Sibling:String,
    Password:String,
    email:String,
    DOb:String,
    Gender:String,
    Address:String,
    Fees:Number,
    No_of_Sub:Number,
    Name_ofSubjects:String,
    });
    module.exports=mongoose.model('Student',StudentSchema);
    