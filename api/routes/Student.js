const express = require('express');
const jwt=require('jsonwebtoken');
const http=require('http');
const checkAuth = require('../middleware/checkauth');
const router =express.Router();
const FAQ=require('../models/FAQ');
const Course=require('../models/course');
const multer = require('multer');
const Fees=require('../models/Fees')
const Faculty=require('../models/faculty')
const Student=require('../models/Student')
const Registered=require('../models/registered');
const Activities=require('../models/Activities')
const Marks=require('../models/Marks')
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const async = require('async');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});
//login
router.post('/login',(req,res,next)=>{
   Student.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length<=0){
                return res.status(401).json({
                    message: 'Please enter valid email'
                });}
            
         bcrypt.compare((req.body.password),user[0].password,(err,result)=>{
                if(err) {
                    return res.status(401).json({
                        message: 'Username or password incorrect'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                          email: user[0].email,
                            _id: user[0]._id
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

//register
   router.post('/register',(req, res, next) => {
    Registered.find({email:req.body.email})
    Student.find({email:req.body.email})
    .exec()
    .then(registered => {
            if (registered.length >= 1) {
                res.status(409).json({
                    message: 'You Are Already registered'
                });
            } 
            else{
            const yy= req.body.DOb.slice(0,4)
            const mm=req.body.DOb.slice(5,7)
            const dd=req.body.DOb.slice(8,10)
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
          DOb:dd + "-"+ mm + "-"+ yy,
          Sibling:req.body.Sibling,
          Sibling_name:req.body.Sibling_name,
          School_name:req.body.School_name,
          Address:req.body.Address,
          Class:req.body.Class,
          No_of_Sub:req.body.No_of_Sub,
          Name_ofSubjects:[req.body.Name_ofSubjects],
          Board:req.body.Board
      });
  
      registered.save().then(result => {
          console.log(result);
          res.status(201).json({
              message: 'You Are Registered Visit Us to Confirm Admission ',
              data: result
          });
      })
          .catch(err => {
              res.status(500).json({
                  error: err,
              message:'Something went wrong'
              });
          });
        }
    })
    })
  //faq  
router.get('/FAQ', function (req, res, next) {
    FAQ.find().exec().then(result => {
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
//activity photo
router.get('/phot',function (req, res, next) {
    Activities.find().exec().then(result => {
         if (!result.length) res.status(404).json({
             message: "No data to display"
         });
         else { 
             res.status(200).json(
             result);}
     }).catch(err => {
         res.status(500).json({
             error: err,
             message:"Something went wrong"
         });
     });
 })

 router.get('/photoa/:_id',function (req, res, next) {
    Activities.find({_id:req.params._id}).exec().then(result => {
         if (!result.length) res.status(404).json({
             message: "No data to display"
         });
         else { console.log(result)
             res.status(200).json(
             result);}
     }).catch(err => {
         res.status(500).json({
             error: err,
             message:"Something went wrong"
         });
     });
 })
//particular activity photo
 
router.get('/photo/:_id',(req, res, next) => {
    Activities.find({_id : req.params._id})
        .exec()
        .then(result => {
            if(result.length >= 0){
                photos=result[0].Photos
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
//faculty
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
router.get('/course', function (req, res, next) {
   Course.find().exec().then(result => {
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

//after login

//result
router.get('/result',checkAuth, (req, res, next) => {
   
    Marks.find({student_id : req.userData._id}).exec()
          .then(result => {
              if (result.length >= 0) {
                 
                 Mar=result[0].mar
                  console.log(Mar);
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

 //fees
 router.get('/fees',checkAuth, (req, res, next) => {
    Fees.find({student_id : req.userData._id}).exec()
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
             res.status(500).json({
                 error:err,
                 message:"Something went wrong"
            }
            );
         });
})
//viewprofile
router.get('/viewprofile',checkAuth, (req, res, next) => {
    Student.find({_id:req.userData._id})
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

//    //editprofilerouter.patch('/update/:_id', checkAuth,upload.single('Photo'),(req, res, next) => {  
// //     const updateOps={}
// //     for(const ops in req.body){
// // updateOps[ops.propname]
// //     }
// Admin.findOneAndUpdate({_id: req.userData.id}, {$set: {
//     Name: req.body.Name,
//     Photo: "http://localhost:3000/uploads/" +req.file.originalname,
//     contact_number: req.body.contact_number,   
// }})
//     .exec()
//     .then(result => {
//              res.status(200).json({
//             message: 'Profile updated successfully'
//         });
//     })
//     .catch(err => { 
//         res.status(500).json({
//             error: err
//      });
// })
// })


   router.patch('/update/:_id', upload.single('Photo'),(req, res, next) => {
            
    Student.findOneAndUpdate({_id: req.userData._id}, {$set: {
    Student_name: req.body.Student_name,
    Photo: "http://localhost:3000/uploads/"+req.file.originalname,
    father_contact_number: req.body.father_contact_number,
     Father_name:req.body.Father_name,
     Father_occupation:req.body.Father_occupation,
     Mother_name:req.body.Mother_name,
     Mother_occupation:req.body.Mother_occupation,
     mother_contact_number:req.body.mother_contact_number,
     Gender:req.body.Gender,
     School_name:req.body.School_name,
     email:req.body.email,
     DOb:req.body.DOb,
     Sibling:req.body.Sibling,
     Sibling_name:req.body.Sibling_name,
     Address:req.body.Address,
        
    }})
        .exec()
        .then(result => {console.log("cvjcj")

            res.status(200).json({
                message: ' Profile updated successfully'
            });
        })
        .catch(err => {
            
            res.status(500).json({
                
                error: err
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
           Student.findOne({email: req.body.email,father_contact_number:req.body.father_contact_number}, function (err, user) {
               if (!Student) {
                   req.status('Error', 'No account with that email address exists');
                   // res.status(200).json({message:'Error! No account with that email address exists'});
                   return res.redirect('/forgotpassword');
                   
               }
               console.log(user)
               if(user!=null){
               user.student_resetPasswordToken = token;
               user.student_resetPasswordExpires = Date.now() + 7200000;
               user.save(function (err) {
                  //  res.status(200).json({message:'Error! No account with that email address exists'});
                   done(err, token, user);
               });
        }
       else{
       res.status(500).json({message:'Error! EMail and contact number doesnot match'});
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
                   user:'scubeclasse@gmail.com',
                   pass:'scubeclass'
               },
               tls: {
                   rejectUnauthorized: false
               }
           }));
           var mailOptions = {
               to: user.email,
               from:'scubeclasse@gmail.com',
               subject:'Password Reset',
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
  Student.findOne({
      student_resetPasswordToken: req.params.token,
      student_resetPasswordExpires : {$gt: Date.now()}
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
           Student.findOne({
                student_resetPasswordToken: req.body.token,
                student_resetPasswordExpires: {$gt: Date.now()}
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
                          Student_name=user.Student_name;
                         father_contact_number=user.father_contact_number;
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
                    user.student_resetPasswordToken = undefined;
                    user.student_resetPasswordExpires = undefined;
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
//change password
router.post('/changepassword',checkAuth, function (req, res) {
   Student.find({_id:req.userData._id})
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
                           Student.update({_id:req.userData._id},{$set: {
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

module.exports =router;