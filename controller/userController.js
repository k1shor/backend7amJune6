const User = require('../model/userModel')
const Token = require('../model/tokenModel')
const jwt = require('jsonwebtoken')
const sendEmail = require('../middleware/sendEmail')
const crypto = require('crypto')
const { expressjwt } = require('express-jwt')


// jwt - jsonwebtoken - user authentication

// to add user/register
exports.addUser = async(req,res) => {
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({error:"Email already exists. Please log in or try different email address."})
    }
    else{
        // if email does not exist,create new user create token, send token in email and register
        let new_user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        new_user = await new_user.save()
        if(!new_user){
            return res.status(400).json({error:"something went wrong"})
        }
        else{
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: new_user._id
            })
            token = await token.save()
            if(!token){
                return res.status(400).json({error:"something went wrong"})
            }

            // const url = `http://localhost:5000/api/confirmuser/${token.token}`
            const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`

            // send email
            sendEmail({
                from:"noreply@admin.com",
                to:new_user.email,
                subject: "Email Verification.",
                text: `Please click on the following link or copy paste it in the browser to verify your account.<br/> ${url}`,
                html: `<a href= '${url}'><button>Verify Email</button></a>`
            })        

            res.send(new_user)
        } 
    }    
}

exports.confirmUser = async (req,res)=>{
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired."})
    }
    else{
        let user = await User.findOne({_id: token.userId})
        if(!user){
            return res.status(400).json({error:"User associated with the token do not exist"})
        }
        else{
            if(user.isVerified){
                return res.status(400).json({error:"User already verified. Login to continue"})
            }
            else{
                user.isVerified = true
                user = await user.save()
                if(!user){
                    return res.status(400).json({error:"Something went wrong"})
                }
                return res.status(200).json({message:"User verified successfully"})
            }
        }
    }
}

// resend confirmation
exports.resendConfirmation = async(req,res) => {
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered. Please register."})
    }
    if(!user.authenticate(req.body.password)){
        return res.status(400).json({error:"Email and password donot match."})
    }
    if(user.isVerified){
        return res.status(400).json({error:"User already verified. Login to continue"})
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"something went wrong"})
    }

    const url = `http://localhost:5000/api/confirmuser/${token.token}`

    // send email
    sendEmail({
        from:"noreply@admin.com",
        to:user.email,
        subject: "Email Verification.",
        text: `Please click on the following link or copy paste it in the browser to verify your account.<br/> ${url}`,
        html: `<a href= '${url}'><button>Verify Email</button></a>`
    })       
    
    return res.status(200).json({message:"Password reset link has been sent to your email."})

}

// signin process
exports.signIn = async(req,res) => {
    // destructing to get email and password from body
    const {email, password} = req.body
    //check if email exists or not
    let user = await User.findOne({email})
    if(!user){
        return res.status(400).json({error:"User not found./ Email not registered"})
    }
    // if email is found, check if password is correct or not
    if(!user.authenticate(password)){
        return res.status(400).json({error:"Email and Password do not match"})
    }
    // if email and password are correct, check if verified or not
    if(!user.isVerified){
        return res.status(400).json({error:"Email not verified. Please verify to continue"})
    }
    // if email is verified, signin
    const token = jwt.sign({_id:user._id, user: user.role}, process.env.JWT_SECRET)
    // store information in cookie
    res.cookie('myCookie',token, {expire: Date.now()+86400})
    //to use/send information in frontend
    const {_id, name, role} = user
    return res.status(200).json({token, user:{_id, name, role, email}})
}

// signout process
exports.signOut = (req,res) => {
    res.clearCookie('myCookie')
    res.json({message:"Signed out succcessfully"})
}

// forget password
exports.forgetPassword = async(req,res) => {
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered."})
    }
    // if user is found, generate token and email reset link
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id    })
        token = await token.save()
        if(!token){
            return res.status(400).json({error:"something went wrong"})
        }

        const url = `http://localhost:5000/api/resetpassword/${token.token}`

        sendEmail({
            from:"noreply@admin.com",
        to:user.email,
        subject: "Password reset Link.",
        text: `Please click on the following link or copy paste it in the browser to reset your password.<br/> ${url}`,
        html: `<a href= '${url}'><button>Reset Password</button></a>`
        })

        res.status(200).json({message:"Password reset link has been sent to your email."})
}
// reset password
exports.resetPassword = async(req,res) => {
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error: "token invalid or token may have expired."})
    }
    let user = await User.findById(token.userId)
    if(!user){
        return res.status(400).json({error: "User not found"})
    }
    user.password = req.body.password
    user = await user.save()
    if(!user){
        res.status(400).json({error: "Something went wrong."})
    }
    res.status(200).json({message:"Password updated successfully."})
}
// view userslist
exports.userlist = async (req,res) => {
    let user = await User.find().select("-hashed_password").select("-salt")
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

//  view user details
exports.userDetails = async(req,res) => {
    let user = User.findById(req.params.id).select("-hashed_password").select("-salt")
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

// to remove users
exports.deleteUser = (req,res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user=>{
        if(!user){
            return res.status(400).json({error:"User not found."})
        }
        else{
            return res.status(200).json({message: "User deleted successfully"})
        }
    })
    .catch(err=>res.status(400).json({error:"something went wrong"}))
}

// for authorization
exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})