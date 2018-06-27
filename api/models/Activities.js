const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Activity:String,
   Photos:[{
       Photo:String,
   }]
});

module.exports =  mongoose.model('Activity', ActivitySchema);