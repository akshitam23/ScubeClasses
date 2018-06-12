const mongoose =  require('mongoose');
const datef=require('x-date');
const UserSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required:true,
        // unique:true,
         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
   password:{type:String,required:true},
  first_name:{type:String,requied:true},
   last_name:{type:String,requied:true},
   DOb:{type:String,requied:true,
},
   contact_number: {
    type: Number,
    required:true,
    match: /^[0-9]$/
},
    });
   
    