exports.isLoggedIn = async (req,res,next) =>{
    if (!req.session.userId || !req.isAuthenticated()) {
        return res.status(401).json({
            message:"not authorized to perform this action"
        })
    }
    next()
}