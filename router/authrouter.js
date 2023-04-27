const express = require('express');
const router = express.Router();
const AuthControllers= require('../controller/authController')
const path=require('path');
const authvalid=require('../middelware/validation');
const authvalidresult=require('../middelware/validationresult')
// const models=require('../models');
// const User=models.User;

// router.post('/register',[check("email").isEmail().withMessage("the email is not valid").custom(value=>{
//   return User.findOne({
//     email:value
//   }).then(user=>{
//     if(user){
//       return Promise.reject('email already in use');
//     }
        
//   })
 
// // }),(req,res)=>{
// //     const error=validationResult(req);
// //     if (!error.isEmpty()) {
// //         return res.status(400).json({
// //             errors: error.array()
// //         });
// //     }

// }],AuthControllers.postregister);
router.post('/register',authvalid.registerValidation,authvalidresult,AuthControllers.postregister);
router.post('/login',authvalid.loginvalidation,authvalidresult,AuthControllers.postlogin);
router.post('/forgotpass',authvalid.forgotpassvalid,authvalidresult,AuthControllers.forgotpass);
router.get('/reset/:token',AuthControllers.getreset);
router.post('/reset',AuthControllers.postreset);


module.exports = router;