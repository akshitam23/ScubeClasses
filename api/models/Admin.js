const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    Name:String,
    email: {
        type: String,
        required:true,
        // unique:true,
         match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
   password : String,
   Photo:String,
    
   contact_number: {
    type: Number,
    required:true,
    match: /^[0-9]$/},

    admin_resetPasswordToken : String,
    admin_resetPasswordExpires : String
});

module.exports =  mongoose.model('Admin', adminSchema);