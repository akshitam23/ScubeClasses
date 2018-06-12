const mongoose =  require('mongoose');
const datef=require('x-date');
const RegisteredSchema=mongoose.Schema({
            _id:mongoose.Schema.Types.ObjectId,
            Student_name:{type:String,requied:true},
            Father_name:{type:String,requied:true},
            Father_occupation:{type:String,requied:true},
            father_contact_number: {
                type: Number,
                required:true,
                match: /^[0-9]$/},
            Mother_name:{type:String,requied:true},
            Mother_occupation:{type:String,requied:true},
            mother_contact_number: { 
            type: Number,
            required:true,
                match: /^[0-9]$/},
                email: {
                    type: String,
                    required:true,
                    // unique:true,
                     match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                },
                Gender:{type:String,requied:true},
                DOb:{type:String,requied:true,
            },
            Sibling: {type:String,requied:true},
            Sibling_name: {type:String},
            School_name: {type:String,requied:true},
            Address: {type:String,requied:true},
            Class: {type:Number,requied:true},
            No_of_Sub:{type:Number,requied:true},
            Name_ofSubjects:[]

    });
    module.exports=mongoose.model('Registered',RegisteredSchema);
    