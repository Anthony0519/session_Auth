const router = require("express").Router()
const { createUser, signIn, updateUser, forgetPassword, getAll, logOut, socialAuth, callBack } = require("../controller/controller")
const { isLoggedIn } = require("../middlewares/session")

router.route("/signup").post(createUser)
router.route("/login").post(signIn)
router.route("/sociallogin").get((req,res)=>{
    res.redirect("http://localhost:2824/auth/google/callback")
})
router.route("/logout").post(logOut)
router.route("/forgetPassword").get(forgetPassword)
router.route("/update/:id").put(updateUser)
router.route("/getall").get(isLoggedIn,getAll)

router.route("/auth/google/callback").get(socialAuth)
router.route("auth/google/success").get((req,res)=>{})

// router.route("auth/google").get(callBack)

module.exports = router
