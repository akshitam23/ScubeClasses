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
const Course=require('../models/course')
const Admin=require('../models/Admin')
const Registered=require('../models/registered');
const Student=require('../models/Student');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const async = require('async');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');
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
//add admin
router.post('/add',checkAuth,(req, res, next) => {
    Admin.find({email: req.body.email})
      .exec()
      .then(user => {
              if (user.length >= 1) {
                  res.status(409).json({
                      message: 'User already exists, try different email'
                  });
              } 
              else{
     bcrypt.hash(req.body.password,10,(err,hash)=>{
          if (err) {
              return res.status(500).json({
                  error: err
              });
          } 
          else{
         
              const admin = new Admin({
                  _id: new mongoose.Types.ObjectId(),
                  email:req.body.email,
                 Name: req.body.Name,
                  password: hash,
                 contact_number:req.body.contact_number,

              });
             admin.save()
              .then(result => {
                  res.status(200).json({
                      message: 'New user added'
                  });
              })
              .catch(err => {
                  
                  res.status(500).json({
                      error: err,
                      message:"Something went wrong"
                  });
              });
           }
      });
      }
      });
  })
 //view admin
router.get('/getadmin', function (req, res, next) {
    Admin.find().exec().then(result => {
        if (result.length<1) 
        res.status(404).json({ message: "No data to display" });
     
        else {   
            res.status(200).json(result);}
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something Went Wrong"
            
        });
    });
})
//delete admin
router.delete('/removeadmin/:_id',checkAuth, function (req, res, next) {
   Admin.findOneAndRemove({ _id: req.params._id })
          .exec()
          .then(result => {
          
              res.status(200).json(result);
          })
          .catch(err => {
              res.status(500).json(err);
          });
  })
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

//change password
router.post('/changepassword',checkAuth, function (req, res) {
    Admin.find({_id:req.userData.id})
        .exec().then(user=>{
             if (req.body.newpassword === req.body.confirmpassword) {
                        console.log(user);
                     user.password = req.body.newpassword;
                        bcrypt.hash(user.password, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                });
                            } else {
                           Admin.update({_id:req.userData.id},{$set: {
                                                        password:  hash
                                                    }})
                                                    
                                    .then(result => {
                                        
                                        res.status(200).json({
                                            message: 'Password changed successfully'
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
                    else{
                        res.status(200).json({message:'both fields should be same'})
                    }
             })
     })

//view profile
router.get('/viewprofile',checkAuth, (req, res, next) => {
 Admin.find({_id:req.userData.id})
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
            res.status(500).json({message:'Something went wrong'});
        });
})

//editprofile
router.patch('/update/:_id', checkAuth,upload.single('Photo'),(req, res, next) => {  
//     const updateOps={}
//     for(const ops in req.body){
// updateOps[ops.propname]
//     }
Admin.findOneAndUpdate({_id: req.userData.id}, {$set: {
        Name: req.body.Name,
        Photo: "http://localhost:3000/uploads/" +req.file.originalname,
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
    })
})

  //faq
//faq post
router.post('/FAQ',checkAuth,(req, res, next) => {
    const faq = new FAQ({
        _id: new mongoose.Types.ObjectId(),
        Questions:req.body.Questions,
        Answers:req.body.Answers
        
    })
   faq.save().then(result => {
       
        res.status(200).json({
            message: 'FAQ added Successfully',
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
            res.status(500).json({message:'Something went wrong'});
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
                 message: 'FAQ updated successfully',
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

//other function
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
            message: 'Faculty data added Successfully',
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err,
                message:'OOPS!!Something went wrong'
        });
    });
})
//view faculty
router.get('/faculty', function (req, res, next) {
    Faculty.find().exec().then(result => {
        if (result.length<1) res.status(404).json({
            message: "No data to display"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something Went Wrong"
            
        });
    });
})
//delete faculty
router.delete('/removefaculty/:_id',checkAuth, function (req, res, next) {
    Faculty.findOneAndRemove({ _id: req.params._id })
          .exec()
          .then(result => {
          
              res.status(200).json(result);
          })
          .catch(err => {
              res.status(500).json(err);
          });
  })
//course
router.post('/course',checkAuth,function (req, res, next) {
    const course = new Course({
        _id: new mongoose.Types.ObjectId(),
        Course_description:req.body.Course_description
    })
 course.save().then(result => {
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
//delete faculty
router.delete('/removecourse/:_id',checkAuth, function (req, res, next) {
    Course.findOneAndRemove({ _id: req.params._id })
          .exec()
          .then(result => {
          
              res.status(200).json(result);
          })
          .catch(err => {
              res.status(500).json(err);
          });
  })
//activity post
router.post('/activity',checkAuth,upload.single('Photo'),(req, res, next) => {
    Activities.find({Activity:req.body.Activity})
        .exec()
        .then(data=>{
            if(!data.length){
               
                const activity=new Activities({
                    _id : new mongoose.Types.ObjectId(),
                    Activity:req.body.Activity,
                    Photos:{Photo: "http://localhost:3000/uploads/"+ req.file.originalname,
                }
                })
               activity.save()
                    .then(result => {
                        console.log(result)
                        res.status(200).json({message :'Photo added'})
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
            Photos.push({
               Photo:"http://localhost:3000/uploads/"+ req.file.originalname
            
            })
               
                Activities.update({Activity:req.body.Activity},{$set: {
                        Photos:Photos
                    }}).then(data2=>{

                        res.status(200).json({message :'Photo added'});
                }).catch(error2=>{
                    res.status(500).json({error: error2,
                    message:'Something went wrong'});
                });
            }
        })
    
})
//activity photo
router.get('/phot',function (req, res, next) {
    Activities.find().exec().then(result => {
         if (!result.length) res.status(404).json({
             message: "No data to display"
         });
         else { 
             res.status(200).json(result)}
     }).catch(err => {
         res.status(500).json({
         error: err,
         message:"Something went wrong"
         });
     });
 })

 //get for delete
 router.get('/photo/:_id',(req, res, next) => {
    Activities.find({_id:req.params._id})
        .then(result => {
            if(result.length >= 0){
            photos=result[0].Photos
                console.log(photos)
                res.status(200).json(photos);
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
//remove activity
router.delete('/removeactivity/:_id/:_pid', function (req, res) {
    Activities.findByIdAndUpdate(
        {_id:mongoose.Types.ObjectId(req.params._id) }, 
        { $pull: { Photos: { _id:mongoose.Types.ObjectId(req.params._pid)  }} },
   function(err,user){
if(err)
{
     res.status(500).json(err);
}

 res.status(200).json({message:"deleted"})
      });
    
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

// delete after confirm in registration
router.delete('/remove/:_id',checkAuth, function (req, res, next) {
  Registered.findOneAndRemove({ _id: req.params._id })
        .exec()
        .then(result => {
        
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
})



//   router.delete('/removeactivity/:_id/:_pid', function (req, res, next) {
//     Activities.find({_id:req.params._id})
//     .then(result => {
//         console.log("dsvhhh")
//         if(result.length >= 0){
// photos=result[0].Photos
// // Activities.update({_id:req.params._id}, 
// //     { $pull: { photos: { _id: _pid } } },

// // );
// Activities.update({_id:req.params._id},{$pull: {
//     photos:{_id:req.params._pid}
// }},{multi:true})
// res.status(200).json(photos)
//         }else {
//             res.status(404).json({
//                 message: "No entries found for the ID!"
//             });
//         }
//     })
//     .catch(err => {
//         res.status(500).json(err);
//     });
//   })

  
// confirm student admission
router.post('/confirmstudent',checkAuth, (req, res, next) => {
    Student.find({email: req.body.email})
        .exec()
        .then(data => {
                if (data.length >= 1) {
                    res.status(409).json({
                        message: 'Student email already exists, try different email'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hashed_pass) => {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                                message:"Something went wrong"
                            });
                        } else {
                            const student = new Student({
                                _id: new mongoose.Types.ObjectId(),
                                Student_name: req.body.Student_name,
                                Father_name:req.body.Father_name,
                                Mother_name:req.body. Mother_name,
                                Father_occupation:req.body.Father_occupation,
                                Mother_occupation:req.body.Mother_occupation,
                                father_contact_number:req.body.father_contact_number,
                                mother_contact_number:req.body.mother_contact_number,
                                School_name:req.body.School_name,
                                Sibling_name:req.body.Sibling_name,
                                Class:req.body.Class,
                                email:req.body.email,
                                Gender:req.body.Gender,
                                DOb:req.body.DOb,
                                Address:req.body.Address,
                                No_of_Sub:req.body.No_of_Sub,
                                Name_ofSubjects:req.body.Name_ofSubjects,
                                Sibling:req.body.Sibling,
                                Fees:req.body.Fees,
                                password:hashed_pass,
                                Board:req.body.Board
                            });
                            student.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'Student added'
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
            }
        );
})

//view registerd for confirmation and entering fees
router.get('/view/:_id',checkAuth, (req, res, next) => {
Registered.find({_id : req.params._id})
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
        res.status(500).json({error:err,
        message:"Something went wrong"});
    });
})

//student after admission
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
                const dd= req.body. ExamDate.slice(0,2)
                const mm=req.body. ExamDate.slice(2,4)
                const yy=req.body. ExamDate.slice(4,8)
                const mark=new Marks({
                    _id : new mongoose.Types.ObjectId(),
                    Student_name:req.body.Student_name,
                    student_id : req.params.student_id,
                    mar:{
                        Subject:req.body.Subject,
                        ExamDate:dd + "-"+ mm + "-"+ yy,
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
                const dd= req.body.ExamDate.slice(0,2)
                const mm=req.body.ExamDate.slice(2,4)
                const yy=req.body.ExamDate.slice(4,8)
            const mar  =  data[0].mar;
            mar.push({
                Subject:req.body.Subject,
                ExamDate:dd + "-"+ mm + "-"+ yy,
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
                        Cheque_No:req.body.Cheque_No,
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
           
            if(data[0].FeesPaid[FeesPaid.length-1].FeesLeft-req.body.HowMuch>=0){
            FeesPaid.push({
                HowMuch:req.body.HowMuch,
                Cheque_No:req.body.Cheque_No,
                FeesLeft:data[0].FeesPaid[FeesPaid.length-1].FeesLeft-req.body.HowMuch,
                day:Date().slice(0,4),
                time:Date().slice(15,25),
                date:Date().slice(4,15)
                })
            
                Fees.update({student_id:req.params.student_id},{$set: {
                        FeesPaid:FeesPaid
                    }}).then(data2=>{
                        console.log(data2);
                        
                        res.status(200).json({message :'success'});
                }).catch(error2=>{
            
                    res.status(500).json({error: error2});
                })}
            
                else{
                    res.status(200).json({message:'Fees paid can not be greater than fees left or No fees left to pay'})
                }
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


//get all student detail
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
    Student.find({Class:req.body.Class,Board:req.body.Board,Name_ofSubjects: { "$regex": req.body.Subject.toString(), "$options": "i" }}).exec().then(result => {
        if (!result.length) res.status(404).json({
            message: "No data Found"
        });
        else res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"Something went wrong"
        });
    });
})


// forgot password
router.post('/forgotpassword', function (req, res, next) {
     async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Admin.findOne({email: req.body.email,contact_number:req.body.contact_number}, function (err, user) {
                if (!Admin) {
                    req.status('Error', 'No account with that email address exists');
                    // res.status(200).json({message:'Error! No account with that email address exists'});
                    return res.redirect('/forgotpassword');
                    
                }
                console.log(user)
                if(user!=null){
                user.admin_resetPasswordToken = token;
                user.admin_resetPasswordExpires = Date.now() + 7200000;
                user.save(function (err) {
                   //  res.status(200).json({message:'Error! No account with that email address exists'});
                    done(err, token, user);
                });
         }
        else{
        res.status(500).json({message:'Error! Email and contact number doesnot match'});
        res.end();
        } });
        },
        function (token, user, done) {
            var transport = nodemailer.createTransport(smtpTransport({
                host: 'localhost',
                port: 3000,
                secure: 'false',
                service: 'Gmail',
                auth: {
                    user: 'scubeclasse@gmail.com',
                    pass: 'scubeclass'
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));
            var mailOptions = {
                to: user.email,
                from: 'scubeclasse@gmail.com',
                subject: 'Password Reset',
                text: 'You are receiving this because you have requested the reset of the password' +
                ' Please paste the following link, in reset password token column\n ' +
                token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remail unchanged'
            };
            transport.sendMail(mailOptions, function (err) {
                console.log('Mail Sent');
                console.log('Success An email has been set to ' + user.email + ' with further instructions.');
               
                res.status(200).json({message :'An email has been set to ' + user.email + ' with further instructions.'});
                done(err, 'done');
            });
        }
    ], 
    // function (err) {
    //     if (err) return next(err);
    //     res.redirect('/forgotpassword');
    // }
);
});

//reset token
router.get('/reset/:token', function (req, res) {
    console.log(req.params.token);
    Admin.findOne({
        admin_resetPasswordToken: req.params.token,
       admin_resetPasswordExpires : {$gt: Date.now()}
    }, function (err, user) {
        if (!user) {
            console.log('error..Password reset token is invalid or has expired.');
            //return res.redirect('/forgotpassword');
        }
        console.log(req.params.token);
        //res.render('reset',{token:req.params.token});
    });
})

//reset password

router.post('/reset', function (req, res) {
    async.waterfall([
        function (done) {
            Admin.findOne({
                admin_resetPasswordToken: req.body.token,
                admin_resetPasswordExpires: {$gt: Date.now()}
            }, function (err, user) {
                if (!user) {
                    console.log('error..Password reset token is invalid or has expired.');
                }
                if (req.body.password === req.body.confirmpassword) {
                    console.log(user);
                    user.password = req.body.password;
                    bcrypt.hash(user.password, 10, (err, hash) => {
                        
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            user.password = hash;
                            email = user.email;
                           Name = user.Name;
                          contact_number = user.contact_number;
                            console.log(hash);

                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(200).json({
                                        message: 'your password has been changed'
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                            var sendtransport = nodemailer.createTransport(smtpTransport({
                                host: 'localhost',
                                port: 3000,
                                secure: 'false',
                                service: 'Gmail',
                                auth: {
                                    user: 'scubeclasse@gmail.com',
                                    pass: 'scubeclass'
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            }));
                            var mailOptions = {
                                to: user.email,
                                from: 'subeclasse@gmail.com',
                                subject: 'Your password has been changed',
                                text: 'Hello,\n\n' +
                                'This is a confirmation that the password for your account ' + user.ta_email + 'has been changed.\n'
                            };
                            sendtransport.sendMail(mailOptions, function (err) {
                                console.log('Your password has been changed successfully');
                                done(err);
                            });

                        }

                    });
                    user.admin_resetPasswordToken = undefined;
                    user.admin_resetPasswordExpires = undefined;
                    user.save(function (err) {
                        console.log(user);
                        console.log(err);
                    });

                } else {
                    console.log('error..Password do not match');
                    return res.redirect('back');
                }
            });
        },
      
    ], function (err) {
        //res.redirect('/login');
    });
});

//send marks
router.post('/sendmarks/:_id', function (req, res, next) {
    const dd= req.body. ExamDate.slice(0,2)
                const mm=req.body. ExamDate.slice(2,4)
                const yy=req.body. ExamDate.slice(4,8)
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Student.findOne({_id:req.params._id}, function (err, user) {
                if (!Admin) {
                    req.status('Error', 'No account with that email address exists');
                    // res.status(200).json({message:'Error! No account with that email address exists'});
                    return res.redirect('/sendmarks');
                    
                }
                console.log(user)
                if(user!=null){
                user.save(function (err) {
                   //  res.status(200).json({message:'Error! No account with that email address exists'});
                    done(err, token, user);
                });
         }
        else{
        // res.status(200).json({message:'Error! EMail and contact number doesnot match'});
        res.end();
        } });
        },
        function (token, user, done) {
            var transport = nodemailer.createTransport(smtpTransport({
                host: 'localhost',
                port: 3000,
                secure: 'false',
                service: 'Gmail',
                auth: {
                    user: 'scubeclasse@gmail.com',
                    pass: 'scubeclass'
                },
                tls: {
                    rejectUnauthorized: false
                }
            }));
            var mailOptions = {
                to: user.email,
                from: 'scubeclasse@gmail.com',
                subject: 'Student report',
                text:   user.Student_name  + ' has scored '+ req.body.Marks+' out of '+req.body.TotalMarks +
                  ' in test conducted on '
                 +dd + "-"+ mm + "-"+ yy +' of chapter ' + req.body.ChapterName + ' in ' + req.body.Subject
            };
            transport.sendMail(mailOptions, function (err) {
                console.log('Mail Sent');
                console.log('Success An email has been set to ' + user.email + ' with further instructions.');
               
                res.status(200).json({message :'An email has been set to ' + user.email});
                done(err, 'done');
            });
        }
    ], 
    // function (err) {
    //     if (err) return next(err);
    //     res.redirect('/forgotpassword');
    // }
);
});
   

module.exports =router;