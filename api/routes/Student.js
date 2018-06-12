const express = require('express');
const jwt=require('jsonwebtoken');
const http=require('http');
const checkAuth = require('../middleware/checkauth');
const router =express.Router();
const FAQ=require('../models/FAQ');
const User=require('../models/user');
const Fees=require('../models/Fees')
const Student=require('../models/Student')
const Registered=require('../models/registered');
const Marks=require('../models/Marks')
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
var dateFormat = require('dateformat');

router.post('/signup',(req, res, next) => {
    User.find({email: req.body.email})
      .exec()
      .then(user => {
              if (user.length >= 1) {
                  res.status(409).json({
                      message: 'Email already exists, try different email'
                  });
              } 
              else{
     bcrypt.hash(req.body.password,10,(err,hash)=>{
          if (err) {
              return res.status(500).json({
                  error: err
              });
          } 
          else{const parts =req.body.DOb.split("/");
          const dt = new Date(parseInt(parts[2], 10),
                            parseInt(parts[1], 10) ,
                            parseInt(parts[0], 10));
              const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  password: hash,
                  first_name: req.body.first_name,
                  last_name:  req.body.last_name,
                  DOb:dateFormat(req.body.DOb,"dd/mm/yyyy"),
                  contact_number: req.body.contact_number
                 
              });
             user.save()
              .then(result => {
                  console.log(result);
                  res.status(201).json({
                      message: 'You are registeered'
                  });
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).json({
                      error: err
                  });
              });
           }
      });
      }
      });
  })
  
  router.post('/login',(req,res,next)=>{
      User.find({email: req.body.email})
          .exec()
          .then(user => {
              if(user.length<=0){
                  return res.status(401).json({
                      message: 'Please enter valid email'
                  });}
              
           bcrypt.compare((req.body.password),user[0].password,(err,result)=>{
                  if(err) {
                      return res.status(401).json({
                          message: 'Email or password incorrect'
                      });
                  }
                  if(result){
                      const token = jwt.sign(
                          {
                             email: user[0].email,
                              id: user[0]._id
                          },
                          process.env.JWT_KEY,
                          {
                              expiresIn: '1h'
                          }
                      );
                      return  res.status(200).json({
                          message:'Login successful',
                          token:token
                      });
                  }
                  res.status(401).json({
            message:"Email or password incorrect"
                  });
                  console.log(result);
                  
              });
      
          })
          .catch(err=>{
              console.log(err);
              res.status(500).json({
                  error:err
              });
          });
      
   })
   router.get('/result/:_id', (req, res, next) => {
    Marks.find({_id:req.params._id}).exec()
         .then(result => {
             if (result.length >= 0) {
                 console.log(result);
                 res.status(200).json(result);
             } else {
                 res.status(404).json({
                     message: "No entries found for the ID!"
                 });
             }
         })
         .catch(err => {
             res.status(500).json(err);
         });
 });
 router.get('/fees/:_id', (req, res, next) => {
    Fees.find({_id:req.params._id}).exec()
         .then(result => {
             if (result.length >= 0) {
                 console.log(result);
                 res.status(200).json(result);
             } else {
                 res.status(404).json({
                     message: "No entries found for the ID!"
                 });
             }
         })
         .catch(err => {
             res.status(500).json(err);
         });
 });
   router.post('/register',(req, res, next) => {
    Registered.find({email:req.body.email})
    .exec()
    .then(registered => {
            if (registered.length >= 1) {
                res.status(409).json({
                    message: 'You Are Already registered'
                });
            } 
            else{
      const registered = new Registered({
          _id: new mongoose.Types.ObjectId(),
          Student_name:req.body.Student_name,
          Father_name:req.body.Father_name,
          Father_occupation:req.body.Father_occupation,
          father_contact_number: req.body.father_contact_number,
          Mother_name:req.body.Mother_name,
          Mother_occupation:req.body.Mother_occupation,
          mother_contact_number: req.body.mother_contact_number,
          email:req.body.email,
          Gender:req.body.Gender,
          DOb:req.body.DOb,
          Sibling:req.body.Sibling,
          Sibling_name:req.body.Sibling_name,
          School_name:req.body.School_name,
          Address:req.body.Address,
          Class:req.body.Class,
          No_of_Sub:req.body.No_of_Sub,
          Name_ofSubjects:[req.body.Name_ofSubjects]
      });
  
      registered.save().then(result => {
          console.log(result);
          res.status(201).json({
              message: "Data Inserted Successfully!",
              data: result
          });
      })
          .catch(err => {
              res.status(500).json({
                  error: err,
              message:"kdcjjcb"
              });
          });
        }
    })
    })
    
router.get('/FAQ', function (req, res, next) {
    FAQ.find().exec().then(result => {
        if (result.length<1) res.status(404).json({
            message: "No data to display"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"dccc"
            
        });
    });
})

router.patch('/Studentdetail/:_id', (req, res, next) => {
    Registered.find({_id:req.params._id}, {$set : {
        _id: new mongoose.Types.ObjectId(),
        Student_name:req.body.Student_name,
        Father_name:req.body.Father_name,
        Father_occupation:req.body.Father_occupation,
        father_contact_number: req.body.father_contact_number,
        Mother_name:req.body.Mother_name,
        Mother_occupation:req.body.Mother_occupation,
        mother_contact_number: req.body.mother_contact_number,
        email:req.body.email,
        Gender:req.body.Gender,
        DOb:req.body.DOb,
        Sibling:req.body.Sibling,
        Sibling_name:req.body.Sibling_name,
        School_name:req.body.School_name,
        Address:req.body.Address,
        Class:req.body.Class,
        No_of_Sub:req.body.No_of_Sub,
        Name_ofSubjects:[req.body.Name_ofSubjects]
        }})
        Student.save().then(result => {
        res.status(200).json({
            message: "Data updated Successfully!",
            data: result
        });
    })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message: "Something went wrong",
                error: err
            })});
});

module.exports =router;