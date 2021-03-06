const express = require('express');
const jwt=require('jsonwebtoken');
const http=require('http');
const checkAuth = require('../middleware/checkauth');
const router=express.Router();
const FAQ=require('../models/FAQ');
const Marks=require('../models/Marks')
const multer = require('multer');
const Fees=require('../models/Fees')
const Activities=require('../models/Activities')
const Faculty=require('../models/faculty')
const Admin=require('../models/Admin')
const Registered=require('../models/registered');
const Student=require('../models/Student');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
var dateFormat = require('dateformat');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

// login
router.post('/login',(req,res,next)=>{
    Admin.find({email: req.body.email})
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
                            expiresIn: '2h'
                        }
                    );
                    return  res.status(200).json({
                        message:'Login successful',
                        token:token
                    });
                }
                res.status(401).json({
          message:'Email or password incorrect'
                });
                
            });
    
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err,
                message:'Something went wrong'
            });
        });
    
})

//view profile

router.get('/viewprofile',checkAuth, (req, res, next) => {
 Admin.find({id:req.userData._id})
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found for the ID!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
})

//editprofile
router.patch('/update/:_id', checkAuth,upload.single('Photo'),(req, res, next) => {
            
    Admin.findOneAndUpdate({id: req.body._id}, {$set: {
        Name: req.body.Name,
        Photo: "http://localhost:3000/uploads/" +req.file.originalname,
        email: req.body.email,
        contact_number: req.body.contact_number,
        
    }})
        .exec()
        .then(result => {
                 res.status(200).json({
                message: 'Profile updated successfully'
            });
        })
        .catch(err => { 
            res.status(500).json({
                error: err
            });
        });

})


  //faq
//faq post
router.post('/FAQ',checkAuth,(req, res, next) => {
    const faq = new FAQ({
        _id: new mongoose.Types.ObjectId(),
        Questions:req.body.Questions,
        Answers:req.body.Answers,
        
    })
   faq.save().then(result => {
        res.status(200).json({
            message: 'Data Inserted Successfully',
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err,
                messgae:'OOPS!!Something went wrong'
            
            });
        });
})

//faq by id for edititng
router.get('/faqid/:_id',checkAuth, (req, res, next) => {
    FAQ.find({_id : req.params._id})
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found for the ID!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
})

// update faq
router.patch('/updateFAQ/:_id',checkAuth, function (req, res, next) {
    FAQ.findOneAndUpdate({ _id:req.params._id}, {
         $set: {
            Questions: req.body.Questions,
             Answers: req.body.Answers,  
         }
     })
     
         .then(result => {
             res.status(200).json({
                 message: 'Data updated successfully',
                 result: result
             });
         })
         .catch(err => {
             res.status(500).json({
                 message: 'Something went wrong',
                 error: err
             });
         });
 
 })
     
 // get faq all
 router.get('/GETFAQ',checkAuth, function (req, res, next) {
     FAQ.find().exec().then(result => {
         if (!result.length) res.status(404).json({
             message: 'No data to display'
         });
         else res.status(200).json(result);
     }).catch(err => {
         res.status(500).json({
             error: err
         });
     });
 })
 
//delete faq 
router.delete('/deleteFAQ/:_id',checkAuth, function (req, res, next) {
    FAQ.findOneAndRemove({ _id: req.params._id })
        .exec()
        .then(result => {
        
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
})
//add faculty

router.post('/faculty',checkAuth,upload.single('Faculty_Photo'),function (req, res, next) {
    const faculty = new Faculty({
        _id: new mongoose.Types.ObjectId(),
      Faculty:req.body.Faculty,
      Faculty_Qualification:req.body.Faculty_Qualification,
     Faculty_Photo: "http://localhost:3000/uploads/"+ req.file.originalname
    })
   faculty.save().then(result => {
       console.log(result)
        res.status(200).json({
            message: 'Data Inserted Successfully',
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:'OOPS!!Something went wrong'
        });
    });
})


//activity
router.post('/activity',upload.single('Photos'),(req, res, next) => {
    Activities.find({Activity:req.body.Activity})
        .exec()
        .then(data=>{
            if(!data.length){
               
                const activity=new Activities({
                    _id : new mongoose.Types.ObjectId(),
                    Activity:req.body.Activity,
                    Photos: "http://localhost:3000/uploads/"+ req.file.originalname
                })
               activity.save()
                    .then(result => {
                        ;
                        res.status(200).json({message : "success"})
                    })
                    .catch(err => {
                        
                        res.status(500).json({
                            error:err,
                            message:"something went wrong"
                        })
                    })
            }else{
                console.log("else");

            const Photos  =  data[0].Photos;
            Photos.push(
               "http://localhost:3000/uploads/"+ req.file.originalname
            
                );
               
                Activities.update({Activity:req.body.Activity},{$set: {
                        Photos:Photos
                    }}).then(data2=>{
                        console.log(data2);
                        console.log("updated");
                        res.status(200).json({message : "success"});
                }).catch(error2=>{
                    console.log("error");
                    res.status(500).json({error: error2});
                });
            }
        })
    
})


//student before admission
// view registered
router.get('/registered',checkAuth,  (req, res, next) =>{
    Registered.find().exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "No data to display"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something went wrong Internal Error"
        });
    });
})

//view student by id who confirmed
router.get('/studentdetail/:_id',checkAuth, (req, res, next) => {
    Student.find({_id : req.params._id})
        .exec()
        .then(result => {
            if(result.length >= 0){
                res.status(200).json(result);
            }else {
                res.status(404).json({
                    message: "No entries found for the ID!"
                });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
})

//post result for particular student
router.post('/result/:student_id',checkAuth,(req, res, next) => {
    Marks.find({student_id:req.params.student_id})
        .exec()
        .then(data=>{
            if(!data.length){
               
                const mark=new Marks({
                    _id : new mongoose.Types.ObjectId(),
                    Student_name:req.body.Student_name,
                    student_id : req.params.student_id,
                    mar:{
                        Subject:req.body.Subject,
                        ExamDate:req.body.ExamDate,
                        ChapterName:req.body.ChapterName,
                        TotalMarks:req.body.TotalMarks,
                        Marks:req.body.Marks
                    }
                })
               mark.save()
                    .then(result => {
                        
                        res.status(200).json({message : "success"})
                    })
                    .catch(err => {
                       
                        res.status(500).json({
                            error:err,
                            message:"something went wrong"
                        })
                    })
            }else{
            
            const mar  =  data[0].mar;
            mar.push({
                Subject:req.body.Subject,
                ExamDate:req.body.ExamDate,
                ChapterName:req.body.ChapterName,
                TotalMarks:req.body.TotalMarks,
                Marks:req.body.Marks})
     Marks.update({student_id:req.params.student_id},{$set: {
                       mar:mar
                    }}).then(data2=>{
                        res.status(200).json({message : 'success'});
                }).catch(error2=>{
                    res.status(500).json({error: error2});
                });
            }
        })
    
})

//get result of particular student
router.get('/resultget/:student_id',checkAuth, (req, res, next) => {
    Marks.find({student_id : req.params.student_id}).exec()
          .then(result => {
              if (result.length >= 0) {
          Mar=result[0].mar
                  res.status(200).json(Mar);
              } else {
                  res.status(404).json({
                      message: "No entries found for the ID!"
                  })
              }
          })
          .catch(err => {
              res.status(500).json({
                  error:err,
                message:"something went wrong"});
          });
 })

// post particular student fees detail 
router.post('/Fees/:student_id',checkAuth,(req, res, next) => {
    Fees.find({student_id:req.params.student_id})
        .exec()
        .then(data=>{
            if(!data.length){
               
                const fee=new Fees({
                    _id : new mongoose.Types.ObjectId(),
                    Student_name:req.body.Student_name,
                    Fees:req.body.Fees,
                    student_id : req.params.student_id,
                    FeesPaid:{
                        HowMuch:req.body.HowMuch,
                        FeesLeft:req.body.Fees-req.body.HowMuch,
                        day:Date().slice(0,4),
                        time:Date().slice(15,25),
                        date:Date().slice(4,15)
                    }
                })
               fee.save()
                    .then(result => {
                      
                        res.status(200).json({message : 'success'})
                    })
                    .catch(err => {
                      
                        res.status(500).json({
                            error:err,
                            message:'something went wrong'
                        })
                    })
            }else{
                console.log("else");

            const FeesPaid  =  data[0].FeesPaid;
            FeesPaid.push({
                HowMuch:req.body.HowMuch,
                FeesLeft:data[0].FeesPaid[FeesPaid.length-1].FeesLeft-req.body.HowMuch,
                day:Date().slice(0,4),
                time:Date().slice(15,25),
                date:Date().slice(4,15)
                });
                
                Fees.update({student_id:req.params.student_id},{$set: {
                        FeesPaid:FeesPaid
                    }}).then(data2=>{
                        console.log(data2);
                        
                        res.status(200).json({message :'success'});
                }).catch(error2=>{
            
                    res.status(500).json({error: error2});
                });
            }
        })
    
})

//get particular student fees detail  
router.get('/fees/:student_id',checkAuth, (req, res, next) => {
        Fees.find({student_id : req.params.student_id}).exec()
             .then(result => {
                 if (result.length >= 0) {
                    console.log(result[0].FeesPaid.length)
                        feesdetail=result[0].FeesPaid
    
                     console.log(feesdetail);
                     res.status(200).json(feesdetail);
                 } else {
                     res.status(404).json({
                         message: "No entries found for the ID!"
                     });
                 }
             })
             .catch(err => {
                 res.status(500).json(err);
             });
})


// get all student detail
router.get('/students',checkAuth, function (req, res, next) {
    Student.find().exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "No data to display"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something went wrong"
        });
    });
})

// get student by class
router.post('/class',checkAuth, function (req, res, next) {
    Student.find({Class:req.body.Class}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "No data to display"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something went wrong"
        });
    });
});

    
module.exports =router;