const dataBase = require('../model/model');
const sendEmail = require("../helpers/email.js")
const dynamicMail = require("../helpers/linkHtml.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")


// create userr
exports.createUser = async(req,res)=>{
    try {

        // get the users details
        const {fullName, email, password, confirmPassword} = req.body

        // check if the email already exist
        const checkEnail = await dataBase.findOne({email});
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
        const user = await dataBase.create({
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
        const userExist = await dataBase.findOne({email})
        if(!userExist){
            return res.status(400).json({
                message: "wrong email"
            })
        }

        // check for pasword
        const checkPassword = bcrypt.compareSync(password,userExist.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: "wrong password"
            })
        }

        // generate a token for the user if all detail are correct
        req.session.user = userExist
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

exports.getAll = async(req,res)=>{
    try {

        // get all the user from the dataBase
        const allUser = await dataBase.find()

        // check if there is a user
        if (allUser.length === 0) {
            return res.status(400).json({
                error:"no user found"
            })
        }

        // return success message
        res.status(200).json({
            message:`there are ${allUser.length} user's available`,
            data:allUser
        })
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

exports.updateUser = async (req,res)=>{
    try {

        // get the users id
        const id = req.params.id

        // get the user by the id passed
        const user = await dataBase.findByIdAndUpdate(id, req.body, {new:true})

        // throw response
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        res.status(200).json({
            message:"updated successfully",
            data:user
        })
        
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.forgetPassword = async (req,res)=>{
    try {

        // request for the users email
        const {email} = req.body

        // check if the users email exist in the dataBase
        const user = await dataBase.findOne({email})
        if (!user) {
            return res.status(404).json({
                error:"user not found"
            })
        }

        // if user found generate a new token for the user
        const token = jwt.sign({userId:user._id},process.env.jwtKey,{expiresIn:"5mins"})

        const link = `${req.protocol}://${req.get("host")}/resetPassword/${token}`
        const html =  dynamicMail(link, user.firstName)

        sendEmail({
            email: user.email,
            subject:"KINDLY VERIFY YOUR EMAIL",
            html:html
        })

        // throw a success message
        res.status(200).json({
            messaeg:"Email send successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try {

        // get the token to the params
        const {token} = req.params
        // get the newpassword
       const {newPassword,confirmPassword} = req.body
       if(newPassword !== confirmPassword){
        return res.status(400).json({
            error:"password does not match"
        })
       }

    //    check the validity of the token
    const decoded = jwt.verify(token,process.env.jwtKey)

    // find the user from the token
    const user = await dataBase.findById(decoded.userId)
    if (!user) {
        return res.status(400).json({
            error:"user not found"
        })
    }

    // encrypt the new password
    const saltPass = bcrypt.genSaltSync(11)
    const hash = bcrypt.hashSync(newPassword, saltPass)

    user.password = hash
    await user.save()

    res.status(200).json({
        messaeg:"password reset successfully"
    })
        
    } catch (error) {
        res.status(500).json({
            error:error.message
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

exports.socialAuth = passport.authenticate("google",{scope:["email","profile"]})

exports.callBack = passport.authenticate("google",{
    successRedirect:"auth/google/success",
    failureRedirect:"auth/google/failure"
})