const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const router = require("./Router/router")
const cors = require("cors")
const session = require("express-session")
const { isLoggedIn } = require("./middlewares/session")
const passport = require("passport")
const strategy = require("passport-google-oauth2").Strategy

const oneMinute = 60 * 1000
const oneHour = 60 * oneMinute
const oneDay = 24 * oneHour

const app = express()
app.use(cors())
app.use(express.json())
app.use(session({
    secret: process.env.jwtKey,
    resave: false,
    saveUninitialized: true,
    cookie:{ 
        maxAge: oneDay
    }
}))
// initialize passport
app.use(passport.initialize())
// integrate passport with our session auth
app.use(passport.session())



passport.use(new strategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: process.env.redirect_url,
    // passReqToCallback   : true
  },

  (request, accessToken, refreshToken, profile, done)=> {
      return done(err, profile);
  }
));

passport.serializeUser((user,done)=>{
    return done(null,user)
})

passport.deserializeUser((user,done)=>{
    return done(null,user)
})

app.use(router)

app.use("/",isLoggedIn,(req,res)=>{
    res.send({
        message: `welcome ${req.session.user.fullName} to my application`
    })
})
 
dotenv.config()
const port = process.env.port
const password = process.env.pass

mongoose.connect(password).then(()=>{
    console.log("dataBase established successfully")

    app.listen(port, ()=>{
        console.log(`server on port: ${port}`)
    })
}).catch((e)=>{
    console.log(e.message);
})