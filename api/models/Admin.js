const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    Username : String,
   password : String,
    // admin_resetPasswordToken : String,
    // admin_resetPasswordExpires : String
});

module.exports =  mongoose.model('Admin', adminSchema);