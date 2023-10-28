var express = require('express');
var router = express.Router();
var userModelCollection = require('../models/users-model');
var commonMethod = require('../shared/common');
const bcrypt = require("bcrypt");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//userlist
router.post('/list', (req, res) => {
  userModelCollection.find({}, (error, response) => {
      if(error) {
          commonMethod.getApiResponse(res,500, '');
      }else {
          commonMethod.getApiResponse(res,200, 'List', response);
      }
  })
})

//userlist end

// register

router.post('/register', async (req, res) => {
  console.log('log');
  if(req.body){
    let userCollection = await userModelCollection.find({mobileNo: req.body.mobileNo}).exec();
    if(userCollection && userCollection.length == 0){
      let saveNewUser = new userModelCollection(req.body);
              console.log(saveNewUser, 'save new User ');
              // generate salt
              let passwordSalt = await bcrypt.genSalt(10)
              // generate salt end

              // hashing password 
             await bcrypt.hash(saveNewUser.password, passwordSalt, (error, hash) => {  
                if(hash){
                  console.log(hash, 'hash word'); 
                  saveNewUser.password =  hash;

              saveNewUser.save().then((response, err) => {
                  if(err) {
                    console.log(err, 'error save ');
                    commonMethod.getApiResponse(res, 500, '');
                  }
                  if(response) {
                      console.log(response, 'response value');
                      let sendUserData = {
                          name: response.name,
                          email: response.email,
                          userId: response._id,
                          mobileNo: response.mobileNo,
                          recommendCode: response.recommendCode
                      }
                      // sendMailer(req.body.email, 'Welcome to Zeon Family','', 'Congratulations welcome to BTC Family!')
                      commonMethod.getApiResponse(res, 200, 'Congratulations welcome to BTC Family!', sendUserData);
                  }
              });
          }
              });
              // hashing password end
              
    }else {
      commonMethod.getApiResponse(res,300,'Data already present');
    }
    // console.log(userCollection, 'user collection');
    //   userModelCollection.find({mobileNo : req.body.mobileNo},async (error, response)  => {
    //       if(error) {
    //           commonMethod.getApiResponse(res, 500, '');
    //       }
    //       console.log(response, 'response', req.body);
    //       if(response.length == 0){
    //           let saveNewUser = new userModelCollection(req.body);
    //           console.log(saveNewUser, 'save new User ');
    //           // generate salt
    //           let passwordSalt = await bcrypt.genSalt(10)
    //           // generate salt end

    //           // hashing password
    //           let hashPassword =  await bcrypt.hash(saveNewUser.password, passwordSalt);
    //           // hashing password end

    //           console.log(saveNewUser, 'save new password');
    //           saveNewUser.password =  hashPassword;

    //           saveNewUser.save((err, response) => {
    //               if(err) commonMethod.getApiResponse(res, 500, '');;
    //               if(response) {
    //                   console.log(response, 'response value');
    //                   let sendUserData = {
    //                       name: response.name,
    //                       email: response.email,
    //                       userId: response._id,
    //                       mobileNo: response.mobileNo,
    //                       recommendCode: response.recommendCode
    //                   }
    //                   sendMailer(req.body.email, 'Welcome to Zeon Family','', 'Congratulations welcome to Zeon Family!')
    //                   commonMethod.getApiResponse(res, 200, 'Congratulations welcome to Zeon Family!', sendUserData);
    //               }
    //           });
    //       }else {
    //           commonMethod.getApiResponse(res,300,'Data already present');
    //       }
    //   })
  }
});

// register end

// login
router.post('/login', async (req, res) => {
  if(req.body) {
      let isMissingFields = await commonMethod.mandatoryFields(req.body, ['email']);

      if(!isMissingFields.status) {
          commonMethod.getApiResponse(res, 300, isMissingFields.fieldsMandatory);
      }else {
          // commonMethod.getApiResponse(res,200, 'Testubg');
          userModelCollection.findOne({email: req.body.email}, async (error, response) => {
              console.log(response, 'response');
              if(error) {
                  commonMethod.getApiResponse(res,300, 'Something went wrong contact to Admin');
              }

              if(response){
                   // validate password
                  let checkPassword = await bcrypt.compare(req.body.password, response.password);
                  if(checkPassword){
                      let sendUserData = {
                          name: response.name,
                          email: response.email,
                          userId: response._id,
                          mobileNo: response.mobileNo,
                          recommendCode: response.recommendCode
                      }
                      commonMethod.getApiResponse(res, 200, 'login sucessfully', sendUserData);
                  }else {
                      commonMethod.getApiResponse(res, 300, 'Invalid Password');
                  }
                  // validate password end
              }else {
                  commonMethod.getApiResponse(res, 300, 'User not present');
              }
          })
      }
  }
})
// login end


//forgot password
router.post('/forgotPassword', async (req, res) => {
  if(req.body){
      let isMissingFields = await commonMethod.mandatoryFields(req.body, ['email']);
      if(!isMissingFields.status) {
          commonMethod.getApiResponse(res,300, isMissingFields.fieldsMandatory);
      } else {
          userModelCollection.findOne({email: req.body.email}, async (error, userResponse) => {
              if(error){
                  commonMethod.getApiResponse(res,300, 'Something went wrong contact to Admin');
              }

              if(userResponse && userResponse._id) {
                  let generateSixDigitRandomNo = Math.floor(100000 + Math.random() * 900000);
                  userResponse.otp = generateSixDigitRandomNo;
                  console.log(userResponse, 'userResponse');
                  await userResponse.save();
                  let mailHtmlMsg = 'Hello' + userResponse.name + 'please verify your account with OTP ' + generateSixDigitRandomNo;
                  sendMailer(req.body.email, 'Verification OTP from Zeon', mailHtmlMsg);
                  commonMethod.getApiResponse(res, 200, 'OTP sent on your email Id');
              } else {
                  commonMethod.getApiResponse(res, 300, 'Invalid Email Id');
              }
          })
      }
  }
})
//forgot password end

router.post('/verifyOtp', async (req, res) => {
  if(req.body){
      let isMissingFields = await commonMethod.mandatoryFields(req.body, ['email', 'otp']);
      if(!isMissingFields.status){
          commonMethod.getApiResponse(res,300, isMissingFields.fieldsMandatory);
      } else {
          userModelCollection.findOne({otp: req.body.otp, email: req.body.email}, (error, userResponse) => {
              if(error){
                  commonMethod.getApiResponse(res,300, 'Something went wrong contact to Admin');
              }

              if(userResponse && userResponse.otp == req.body.otp){
                  sendMailer(userResponse.email, 'Your new password for Zeon', userResponse.otp);
                  commonMethod.getApiResponse(res, 200, 'Verification Sucessfully');
              }else {
                  commonMethod.getApiResponse(res, 300, 'Invalid OTP')
              }
          })
      }
  }
});


// reset password

router.post('/resetPassword', async (req, res) => {
  if(req.body){
      let isMissingFields = await commonMethod.mandatoryFields(req.body, ['email', 'password']);
      if(!isMissingFields.status){
          commonMethod.getApiResponse(res, 300, isMissingFields.fieldsMandatory);
      }else {
          userModelCollection.findOne({email: req.body.email}, async (error, userResponse) => {
              if (error){
                  commonMethod.getApiResponse(res, 300, 'Something went wrong contact to Admin');
              }

              if(userResponse && userResponse._id){
                  // generate salt
                  let passwordSalt = await bcrypt.genSalt(10);
                  // generate salt end

                  // generate hash password and set to field
                  userResponse.password = await bcrypt.hash(req.body.password, passwordSalt);
                  // generate hash password and set to field end

                  await userResponse.save();
                  
                  commonMethod.getApiResponse(res, 200, 'Password changed successfully !');

              }
          })
      }
  }
})

module.exports = router;
