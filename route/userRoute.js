const express = require('express')
const { addUser, confirmUser, resendConfirmation, signIn, signOut, forgetPassword, resetPassword, userlist, userDetails, deleteUser, requireSignin } = require('../controller/userController')
const { userValidationSchema, validation } = require('../Validation/validator')
const router = express.Router()

router.post('/register',userValidationSchema, validation, addUser)
router.get('/confirmuser/:token', confirmUser)
router.post('/resendconfirmation', resendConfirmation)
router.post('/signin',signIn)
router.get('/signout', signOut)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.get('/userlist',userlist)
router.get('/userdetails/:id', userDetails)
router.delete('/deleteuser/:id', requireSignin,deleteUser)

module.exports = router