const router = require("express").Router()
const { createUser, signIn, loginGoogle, getProfile, logOut, socialAuth, callBack } = require("../controller/controller")
const { isLoggedIn } = require("../middlewares/session")

router.route("/signup").post(createUser)
router.route("/login").post(signIn)
router.route("/sociallogin").get((req,res)=>{
    res.redirect("http://localhost:2824/auth/google/callback")
})
router.route("/logout").post(logOut)
router.route("/profile").get(isLoggedIn,getProfile)

router.route("/auth/google/callback").get(socialAuth)
// router.route("auth/google/success").get((req,res)=>{})

router.route("auth/google").get(callBack, loginGoogle)

module.exports = router
