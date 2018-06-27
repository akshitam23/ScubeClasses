const mongoose =  require('mongoose');
const datef=require('x-date');
const FAQSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
  status:{type:String},
  Questions:{type:String},
  Answers:{type:String}
    });
    module.exports=mongoose.model('FAQ',FAQSchema);
    