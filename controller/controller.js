const User = require('../model/model');
const sendEmail = require("../helpers/email.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")


// create userr
exports.createUser = async(req,res)=>{
    try {

        // get the users details
        const {fullName, email, password, confirmPassword} = req.body

        // check if the email already exist
        const checkEnail = await User.findOne({email});
        if (checkEnail) {
            return res.status(400).json({
                message: `user with email: ${email} already have an account`
            })
        }

        // confirm the password
        if (confirmPassword !== password) {
            return res.status(400).json({
                error:"password does not match"
            })
        }

        // hash the password
        const saltPass = bcrypt.genSaltSync(11)
        const hash = bcrypt.hashSync(password, saltPass)

        // create the user
        const user = await User.create({
            fullName,
            email:email.toLowerCase(),
            password: hash
        })

        // throw a success message
        res.status(200).json({
            message: `hi 😎👋 your account has been succefully created kindly verify your email`,
            data: user
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.signIn = async (req,res)=>{
    try{

        // get the users input
        const {email,password } = req.body;

        // check if tghe user exist
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "wrong email"
            })
        }

        // check for pasword
        const checkPassword = bcrypt.compareSync(password,user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "wrong password"
            })
        }

        // generate a token for the user if all detail are correct
        req.session.userId = user._id
        // throw a success respomse
        res.status(200).json({
            message:"Login successful",
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.logOut = async(req,res)=>{
    try {
        // destroy the session
        req.session.destroy()

        // throw a success message
        res.status(200).json({
            message:"logged out successful"
        })       
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password -googleId');
    res.status(200).json({
        user
    })
  } catch (error) {
    res.status(500).json({
        error:error.message
    })
  }
}

exports.loginGoogle = async (req, res) => {
    try {
        req.session.userId = req.user.id;
        res.redirect('/api/profile');
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.socialAuth = passport.authenticate("google",{scope:["email","profile"]})

exports.callBack = passport.authenticate("google",{
    failureRedirect:"auth/google/failure"
})